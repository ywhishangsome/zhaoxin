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
                <!-- <div class="content-section members-section">
                    <div class="section-header mb">
                        <span class="dot"></span>
                        <el-text bold size="small" class="uppercase">核心成员信息</el-text>
                    </div>

                    <el-row :gutter="16">
                        <el-col v-for="member in members" :key="member.name" :xs="24" :sm="8">
                            <el-card shadow="hover" class="member-card" :body-style="{ padding: '12px' }">
                                <div class="member-inner">
                                    <el-avatar :src="member.avatar" shape="square" :size="48" />
                                    <div class="member-info">
                                        <el-text bold size="small" class="member-name">{{ member.name }}</el-text>
                                        <el-text size="small" type="secondary" class="member-role">{{ member.role
                                            }}</el-text>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div> -->

                <!-- Action -->
                <div class="action-footer">
                    <el-button type="primary" class="submit-btn" size="large" round @click="signUpVisible = true">
                        立即报名
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>

    <SignUpDialog :dialogVisible="signUpVisible" :clubId="currentClub.id" @close="signUpVisible = false" />
</template>

<script setup lang="ts">
import { getClubByIdApi } from '@/api/club';
import { onMounted, ref, watch } from 'vue';
import { getLabel } from '@/utils/ClubCateMap';
import SignUpDialog from './signUpDialog.vue';

const signUpVisible = ref(false);
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
const getcurrentClub = async () => {
    if (!props.id) return;
    try {
        const res = await getClubByIdApi(props.id)
        currentClub.value = res.data
        console.log("111", currentClub.value);
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

// 提取真实图片地址
function getRealImageUrl(url: string) {
    if (!url) return ''
    // 从链接里解析出 mediaurl 参数（真实图片）
    const params = new URLSearchParams(url.split('?')[1])
    return params.get('mediaurl') || url
}
const members = [{
    name: '张明远',
    role: '社长 / President',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYENJ5sPw1fhqsb6dxAKVXBAy7uEyU6XcIfRpLMxRtripNye1-3sVZRbdmnNLwNNnomx_om3iMoBHXPTyCip04UCc64tIh9sfClehHMaSPBL2DB4FdXCXpvUEFJlSVtUTAo4Qk_fno-PFWnsbhBDfUx5IF-3GbjvxfxZsuMzmTET0bTHvdxovTkVnb6oEBaZoULho4tn57m5df6Dnt7e6m9Uq-H8mvLjYeY1x--NbQpVzQe3aPeVrtkV_-jJOVRUb0bEtuzvV-viE'
}, {
    name: '李思涵',
    role: '副社长 / VP',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcwkoTf86ITnoVZdD6M3hFxFIFSJHRqdClVWfqRg2f1dpGKIIHigdhgpC9nOlXsyTJj0LpEvRr695yKMwDz08LdhFBQ6xFxwvOIRoKtbEeNhpdTn4T16t-jFDIKUUzWOSbxp2GKMdtMaoFD_jT7SEHvPv0Hc7ipLKsW4QG7M4VtzNVzqMRPgas_xn8_WU20oJBSQgrKJ7j_PT2-j8DRnnm6BozBNNtXUSv8PBNrI-AiamZ2Vkh1VlmYSFSsf9jBCZstpJp_sijEgI'
}, {
    name: '王嘉禾',
    role: '技术总监 / Tech',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7KkMIp6UuXiMgdmfCvypWnZW-umTz4sM_jXO1kU_ovRVMjOyCCH-vjotEI4YNl1XUBf3VZ1ZfFeypHEn1mBuSgwL1KzFM62nglEgrnBPpXfM4Q4avuDpBhiRfLG6GdpNUbwfok9PgNKSywc3BiNyhwJJjRw_DsyXYwjMeR4J3kSc-xqnqifl3kcewA7Ny_xlJj2LlSYevck4ZpYGnu7UEpZa3ajsP6nqq05KKMfk5Au6drjBw-AFLzNWdoVMD-aRmtufHewM98gY'
}];
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
