import service from '@/utils/axios'

const UploadApi = {
    image: '/clubsystem/upload/image'
} as const

/**
 * 上传图片到 MinIO，返回可访问的图片地址
 * @param file 图片文件
 */
function uploadImageApi(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return service.post(UploadApi.image, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
    })
}

/**
 * 删除已上传的图片（用于放弃编辑时清理未保存的图片）
 * @param url 上传接口返回的图片地址
 */
function deleteImageApi(url: string) {
    return service.delete(UploadApi.image, { params: { url } })
}

export { uploadImageApi, deleteImageApi }
