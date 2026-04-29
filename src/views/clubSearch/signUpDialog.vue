<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ChatLineRound, Promotion } from '@element-plus/icons-vue';
import { signUpApi } from '@/api/sign';
import { ElMessage } from 'element-plus';

const props = defineProps<{ dialogVisible: boolean, clubId?: number }>();
const emit = defineEmits(['close']);

// Default to open for convenience
const submitting = ref(false);

const regForm = reactive({
    reason: ''
});

const rules = {
    reason: [{ required: true, message: '请简单描述一下你自己', trigger: 'blur' }]
};

const formRef = ref();

const handleSubmit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            submitting.value = true;
            try {
                const userId = Number(sessionStorage.getItem('id'));
                if (!userId) {
                    ElMessage.error('用户未登录，请重新登录');
                    return;
                }
                const params = {
                    clubId: props.clubId || 0,
                    userId: userId,
                    apply_note: regForm.reason
                };
                const res: any = await signUpApi(params);
                if (res && res.code === 500) {
                    ElMessage.error(res.message || '报名失败');
                } else {
                    ElMessage.success('报名成功');
                    emit('close');
                }
            } catch (err: any) {
                console.error(err);
                ElMessage.error(err?.response?.data?.message || '报名失败');
            } finally {
                submitting.value = false;
            }
        }
    });
};

</script>

<template>
    <el-dialog :model-value="dialogVisible" @update:model-value="val => !val && emit('close')" width="480px" :show-close="true" align-center destroy-on-close
        style="border-radius: 2rem;padding:20px">

        <template #header>
            <h2 style="text-align: center;">报名申请</h2>
        </template>
        <div class="dialog-body-container">
            <el-form :model="regForm" :rules="rules" ref="formRef" label-position="top" class="custom-form">
                <!-- 个人描述 -->
                <el-form-item prop="reason">
                    <template #label>
                        <div class="label-wrapper">
                            <el-icon :size="16" class="label-icon">
                                <ChatLineRound />
                            </el-icon>
                            <span>简单描述一下你自己...</span>

                        </div>
                    </template>
                    <el-input v-model="regForm.reason" type="textarea" :rows="4" placeholder="简述你想要加入的原因..." />
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer-container">
                <el-button type="primary" class="submit-btn" :loading="submitting" @click="handleSubmit">
                    <el-icon v-if="!submitting" :size="20">
                        <Promotion />
                    </el-icon>
                    提交报名
                </el-button>
            </div>
        </template>


    </el-dialog>
</template>
<style lang="less" scoped>
.dialog-body-container {
    padding: 0.5rem 1.5rem;
}

.label-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.label-icon {
    color: #5a5b60;
}

.custom-form {
    .el-form-item {
        margin-bottom: 1.75rem;
    }

    .el-form-item__label {
        font-weight: 700;
        color: #4b4d52;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        padding: 0 !important;
        line-height: 1.2 !important;
        display: inline-flex !important;
        align-items: center;
    }

    .el-input__wrapper {
        background-color: #f6f6fb !important;
        box-shadow: none !important;
        border: 2px solid transparent !important;
        border-radius: 1rem !important;
        padding: 0.75rem 1.25rem !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

        &.is-focus {
            border-color: #0058bb !important;
            background-color: white !important;
            box-shadow: 0 8px 24px rgba(0, 88, 187, 0.08) !important;
        }
    }

    .el-textarea__inner {
        background-color: #f6f6fb !important;
        box-shadow: none !important;
        border: 2px solid transparent !important;
        border-radius: 1rem !important;
        padding: 1rem 1.25rem !important;
        transition: all 0.3s;

        &:focus {
            border-color: #0058bb !important;
            background-color: white !important;
            box-shadow: 0 8px 24px rgba(0, 88, 187, 0.08) !important;
        }
    }
}

.dialog-footer-container {
    padding: 0 2.5rem 2.5rem;
}

.submit-btn {
    width: 100%;
    height: 3.5rem !important;
    border-radius: 0.75rem !important;
    font-weight: 900 !important;
    font-size: 1.125rem !important;
    background-color: #0058bb !important;
    border: none !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    box-shadow: 0 12px 30px -6px rgba(0, 88, 187, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;

    &:hover:not(.is-loading) {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px -6px rgba(0, 88, 187, 0.4);
    }
}




.label-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}
</style>