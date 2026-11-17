
<template>

    <el-dialog :model-value="dialogVisible" :show-close="true" width="680px" class="custom-dialog" align-center>
        <div class="modal-wrapper" v-if="currentClub.clubName">
            <!-- Header Image -->
            <div class="modal-header">
                <el-image class="header-img"
                    src="https://bpic.588ku.com/back_origin_pic/23/07/01/4fde26b737c048841d7f1afedfc8abb7.png!/fw/400/quality/100/unsharp/true/compress/true"
                    fit="cover" />
                <el-button class="close-btn" circle @click="handleClose">
                    <el-icon>
                        <Close />
                    </el-icon>
                </el-button>

                <div class="logo-badge">
                    <el-card shadow="always" class="logo-card">
                        <el-image :src="getRealImageUrl(currentClub.avatar)" class="logo-icon" fit="cover"></el-image>
                    </el-card>
                </div>
            </div>

            <!-- Body -->
            <div class="modal-body">
                <!-- Main Info Section -->
                <el-row justify="space-between" align="bottom" class="info-row">
                    <el-col :xs="24" :sm="16">
                        <div class="tags-row">
                            <el-tag round effect="dark" class="tech-tag">{{ getLabel(currentClub.category) }}</el-tag>
                            <el-text class="member-count" size="small">
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>{{ `${currentClub.size || 0}位成员` }} </span>
                            </el-text>
                        </div>
                        <h1 class="title">{{ currentClub.clubName }}</h1>
                    </el-col>

                </el-row>

                <!-- Description Section -->
                <el-card shadow="never" class="content-section">
                    <template #header>
                        <div class="section-header">
                            <span class="dot"></span>
                            <el-text bold size="small" class="uppercase">社团简介</el-text>
                        </div>
                    </template>
                    <el-text class="description-text">
                        {{ currentClub.description }}
                    </el-text>
                </el-card>

                <!-- Core Members Section -->
                <div class="content-section members-section" v-if="members.length > 0">
                    <div class="section-header mb">
                        <span class="dot"></span>
                        <el-text bold size="small" class="uppercase">管理人员</el-text>
                    </div>

                    <el-row :gutter="16">
                        <el-col v-for="member in members" :key="member.id" :xs="24" :sm="8">
                            <el-card shadow="hover" class="member-card" :body-style="{ padding: '12px' }">
                                <div class="member-inner">
                                    <el-avatar :src="getRealImageUrl(member.headUrl)" shape="square" :size="48" />
                                    <div class="member-info">
                                        <el-text bold size="small" class="member-name">{{ member.name }}</el-text>
                                        <el-text size="small" type="secondary" class="member-role">{{ getRoleLabel(member.roleType) }}</el-text>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>

                <!-- Action -->
                <div class="action-footer">
                    <el-button type="primary" class="submit-btn" size="large" round @click="handleSign">
                        立即报名
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>

    <!-- Sign Up Dialog -->
    <el-dialog v-model="signDialogVisible" title="报名申请" width="400px" destroy-on-close class="sign-dialog" align-center :show-close="true">
        <template #header="{ titleId, titleClass }">
            <div class="sign-dialog-header">
                <h2 :id="titleId" :class="titleClass" style="text-align: center; margin: 0; font-size: 24px; font-weight: bold; color: #000;">报名申请</h2>
            </div>
        </template>
        <el-form :model="signForm" :rules="signRules" ref="signFormRef" label-position="top">
            <el-form-item prop="apply_note">
                <template #label>
                    <span style="font-size: 16px; color: #5a5b60;">
                        <el-icon style="vertical-align: middle; margin-right: 4px;"><ChatLineRound /></el-icon>
                        简单描述一下你自己...
                    </span>
                </template>
                <el-input 
                    v-model="signForm.apply_note" 
                    type="textarea" 
                    :rows="5" 
                    placeholder="简述你想要加入的原因..." 
                    style="font-size: 14px;"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="text-align: center; margin-top: 10px;">
                <el-button type="primary" size="large" @click="submitSign" style="width: 100%; border-radius: 12px; font-weight: bold; font-size: 16px; background-color: #0058bb;">
                    <el-icon style="margin-right: 8px;"><Position /></el-icon> 提交报名
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { getClubByIdApi, getClubMemberInfoApi } from '@/api/club';
import { signUpApi } from '@/api/sign';
import { onMounted, ref, watch } from 'vue';
import { getLabel } from '@/utils/ClubCateMap';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import { User, Close, Position, ChatLineRound } from '@element-plus/icons-vue';
interface ClubDetail {
    id: number
    createTime: string
    updateTime: string
    isDelete: number
    param: Record<string, any>
    clubName: string
    description: string
    avatar: string
    status: number
    category: number
    size: number

}
const props = defineProps(['dialogVisible', 'id']);
const currentClub = ref<ClubDetail>({} as ClubDetail)
const members = ref<any[]>([])

const getcurrentClub = async () => {
    if (!props.id) return;
    try {
        const res = await getClubByIdApi(props.id)
        currentClub.value = res.data
        console.log("111", currentClub.value);

        // Fetch club members
        const membersRes = await getClubMemberInfoApi(props.id);
        if (membersRes.code === 200 && membersRes.data) {
            // Sort by roleType (1: 社长, 2: 管理员, 3: 成员) and take top 3
            members.value = membersRes.data
                .sort((a: any, b: any) => Number(a.roleType) - Number(b.roleType))
                .slice(0, 3);
        } else {
            members.value = [];
        }
    } catch (err) {
        console.log("获取社团详情失败", err)
    }
}

watch(() => props.id, (newId) => {
    if (newId) {
        currentClub.value = {} as ClubDetail; // 立即清空，不等待
        getcurrentClub();
    }
}, { immediate: true });


const emit = defineEmits(['close']);
const handleClose = () => {
    emit('close');
    // 去掉 500ms 延迟！这是最大卡顿点
    currentClub.value = {} as ClubDetail;
};

const userStore = useUserStore();
const signDialogVisible = ref(false);
const signFormRef = ref();
const signForm = ref({
    apply_note: ''
});

const signRules = {
    apply_note: [
        { required: true, message: '请简单描述一下你自己', trigger: 'blur' },
        { max: 200, message: '最多200个字符', trigger: 'blur' }
    ]
};

const handleSign = () => {
    signForm.value.apply_note = '';
    signDialogVisible.value = true;
};

const submitSign = async () => {
    if (!signFormRef.value) return;
    await signFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                const res = await signUpApi({
                    clubId: currentClub.value.id,
                    userId: userStore.userInfo.id,
                    apply_note: signForm.value.apply_note
                });
                if (res.code === 200) {
                    ElMessage.success('报名成功！');
                    signDialogVisible.value = false;
                } else {
                    ElMessage.error(res.message || '报名失败');
                }
            } catch (err) {
                console.error("报名失败", err);
                ElMessage.error('报名失败');
            }
        }
    });
};

// 提取真实图片地址
function getRealImageUrl(url: string) {
    if (!url) return ''
    // 从链接里解析出 mediaurl 参数（真实图片）
    const params = new URLSearchParams(url.split('?')[1])
    return params.get('mediaurl') || url
}
const getRoleLabel = (roleType: string | number) => {
    switch (Number(roleType)) {
        case 1: return '社长';
        case 2: return '管理员';
        case 3: return '成员';
        default: return '未知';
    }
};
</script>

<style lang="less">
.custom-dialog {
    padding: 0 !important;
    border-radius: 32px !important;
    overflow: hidden !important;
    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.2) !important;
    border: none !important;

    .el-dialog__header {
        display: none !important;
    }

    .el-dialog__body {
        padding: 0 !important;
        background-color: #ffffff;
    }
}

.sign-dialog {
    border-radius: 24px !important;
    .el-dialog__header {
        padding-top: 30px;
    }
}

.modal-wrapper {
    color: #2d2f33;

    .modal-header {
        position: relative;
        height: 200px;
        width: 100%;

        .header-img {
            width: 100%;
            height: 100%;
            border-top-left-radius: 32px;
            border-top-right-radius: 32px;
        }

        .close-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            background-color: rgba(0, 0, 0, 0.2);
            border: none;
            color: #ffffff;
            backdrop-filter: blur(12px);
            z-index: 10;
            width: 40px;
            height: 40px;

            &:hover {
                background-color: rgba(0, 0, 0, 0.4);
                color: #f0f2ff;
            }
        }

        .logo-badge {
            position: absolute;
            bottom: -48px;
            left: 32px;
            z-index: 15;

            .logo-card {
                width: 96px;
                height: 96px;
                background-color: #0058bb;
                border-radius: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 20px 25px -5px rgba(0, 88, 187, 0.15);
                border: none;

                .el-card__body {
                    padding: 0 !important;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }

                .logo-icon {

                    color: #ffffff;
                }
            }
        }
    }

    .modal-body {
        padding: 54px 32px 32px;

        .info-row {
            margin-bottom: 10px;

            .tags-row {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;

                .tech-tag {
                    background-color: #0058bb;
                    color: #ffffff;
                    border-radius: 99px;
                    border: none;
                    font-weight: 800;
                    font-size: 10px;
                    letter-spacing: 0.12em;
                    padding: 0 14px;
                    height: 24px;
                }

                .member-count {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    color: #5a5b60;
                }
            }

            .title {
                font-size: 32px;
                font-weight: 850;
                letter-spacing: -0.015em;
                margin: 0;
                color: #0c0e12;
            }

            .schedule-badge {
                background-color: #f0f0f6;
                color: #4c5e66;
                border: none;
                border-radius: 14px;
                padding: 0 20px;
                height: 44px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                font-size: 14px;
                transition: transform 0.2s ease;



            }
        }

        .content-section {
            margin-bottom: 24px;
            border: none;
            background: transparent;

            &.el-card {
                background-color: transparent;

                .el-card__header {
                    padding: 0;
                    border: none;
                    margin-bottom: 12px;
                }

                .el-card__body {
                    padding: 0;
                }
            }

            .section-header {
                display: flex;
                align-items: center;
                gap: 10px;


                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #0058bb;
                }

                .uppercase {
                    text-transform: uppercase;
                    letter-spacing: 0.15em;

                    color: #5a5b60;
                    font-size: 12px;
                }
            }

            .description-text {
                color: #4d5051;
                line-height: 1.8;
                font-size: 15px;
                display: block;
            }

            .member-card {
                background-color: #f0f0f6;
                border: none;
                border-radius: 20px;
                transition: background-color 0.2s ease;

                &:hover {
                    background-color: #e7e8ee;
                }

                .member-inner {
                    display: flex;
                    align-items: center;
                    gap: 16px;

                    .member-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;

                        .member-name {
                            color: #0c0e12;
                            font-size: 14px;
                        }

                        .member-role {
                            font-size: 11px;
                            color: #5a5b60;
                        }
                    }
                }
            }
        }

        .action-footer {
            margin-top: 40px;

            .submit-btn {
                width: 100%;
                height: 60px;
                border-radius: 18px;
                font-size: 18px;
                font-weight: 800;
                background-color: #0058bb;
                border: none;
                box-shadow: 0 16px 24px -8px rgba(0, 88, 187, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

                &:hover {
                    background-color: #004ca4;
                    transform: translateY(-2px);
                    box-shadow: 0 20px 32px -8px rgba(0, 88, 187, 0.4);
                }

                &:active {
                    transform: translateY(1px);
                }
            }
        }
    }
}

// Responsive Tweaks
@media (max-width: 640px) {
    .modal-body {
        padding: 64px 24px 24px !important;

        .info-row {
            .title {
                font-size: 26px !important;
            }
        }

        .members-section {
            .el-col {
                margin-bottom: 12px;
            }
        }
    }
}

.text-right-sm {
    @media (min-width: 768px) {
        text-align: right;
    }
}
</style>
