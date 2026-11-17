import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { deleteImageApi, uploadImageApi } from '@/api/upload'

/**
 * 图片上限（MB），与后端 minio.max-size 保持一致
 */
const MAX_SIZE_MB = 20

/**
 * 图片上传逻辑复用：单图上传 + 上传前校验 + 未保存图片的清理
 *
 * @param onUploaded 上传成功后回填表单字段的回调
 */
export function useImageUpload(onUploaded: (url: string) => void) {
    const uploading = ref(false)

    /**
     * 本次编辑会话内上传成功、但还没有保存到数据库的图片地址，
     * 用户放弃编辑时用它来清理 MinIO 上的孤儿文件
     */
    const pendingUrls = ref<string[]>([])

    /**
     * 上传前校验：仅图片、大小不超过 20MB
     */
    const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
        if (!rawFile.type.startsWith('image/')) {
            ElMessage.error('只能上传图片文件')
            return false
        }
        if (rawFile.size / 1024 / 1024 > MAX_SIZE_MB) {
            ElMessage.error(`图片大小不能超过 ${MAX_SIZE_MB}MB`)
            return false
        }
        return true
    }

    /**
     * 自定义上传：走 MinIO 上传接口，成功后将地址回填到表单
     */
    const httpRequest = async (options: UploadRequestOptions) => {
        uploading.value = true
        try {
            const res: any = await uploadImageApi(options.file)
            if (res.code === 200 && res.data) {
                // 同一字段重新上传时，上一张未保存的图片已经没有引用，直接删掉
                const replaced = pendingUrls.value
                pendingUrls.value = [res.data]
                onUploaded(res.data)
                void Promise.allSettled(replaced.map((url) => deleteImageApi(url)))
                ElMessage.success('图片上传成功')
            } else {
                ElMessage.error(res.message || '图片上传失败')
            }
        } catch (error) {
            ElMessage.error('图片上传失败')
        } finally {
            uploading.value = false
        }
    }

    /**
     * 保存成功后调用：图片已被数据库引用，不再需要清理
     */
    const confirmUploaded = () => {
        pendingUrls.value = []
    }

    /**
     * 放弃编辑时调用：删除本次上传但未保存的图片
     */
    const discardUploaded = async () => {
        const urls = [...pendingUrls.value]
        pendingUrls.value = []
        if (!urls.length) {
            return
        }
        await Promise.allSettled(urls.map((url) => deleteImageApi(url)))
    }

    return { uploading, beforeUpload, httpRequest, confirmUploaded, discardUploaded }
}
