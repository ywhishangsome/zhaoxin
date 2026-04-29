<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search, User, Calendar, Picture } from '@element-plus/icons-vue';
import { getUserApplyInfoApi, auditApplyApi } from '@/api/sign';
import { ElMessage, ElMessageBox } from 'element-plus';

const searchText = ref('');
const activeTab = ref(''); // 空字符串代表"全部"，否则对应 status 值 (0, 1, 2, 3)

const applications = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const statusMap: Record<string, { label: string, type: string, color: string }> = {
    '0': { label: '待审核', type: 'primary', color: '#3b82f6' },
    '1': { label: '通过', type: 'success', color: '#22c55e' },
    '2': { label: '拒绝', type: 'danger', color: '#ef4444' },
    '3': { label: '取消', type: 'info', color: '#9ca3af' }
};

const getImageUrl = (url: string) => {
    if (!url) return '';
    // 如果是必应搜索结果页面的链接，尝试提取真实的图片地址
    if (url.includes('bing.com/images/search') && url.includes('mediaurl=')) {
        try {
            const urlObj = new URL(url);
            const mediaurl = urlObj.searchParams.get('mediaurl');
            if (mediaurl) {
                return decodeURIComponent(mediaurl);
            }
        } catch (e) {
            console.error('Failed to parse image URL', e);
        }
    }
    return url;
};

const handleSearch = () => {
    currentPage.value = 1;
    loadApplications();
};

const loadApplications = async () => {
    try {
        const params: any = {};
        if (activeTab.value !== '') {
            params.status = activeTab.value;
        }
        if (searchText.value) {
            params.clubName = searchText.value;
        }
        
        const res = await getUserApplyInfoApi(currentPage.value, pageSize.value, params);
        if (res.code === 200) {
            applications.value = res.data.records;
            total.value = res.data.total;
        } else {
            ElMessage.error(res.message || '获取报名信息失败');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('获取报名信息失败');
    }
};

const handleCancel = async (id: number | string) => {
    try {
        await ElMessageBox.confirm('确定要取消该报名申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
        
        const res: any = await auditApplyApi(id, 3);
        if (res && res.code === 500) {
            ElMessage.error(res.message || '取消申请失败');
        } else {
            ElMessage.success('取消申请成功');
            loadApplications();
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error(error);
            ElMessage.error('取消申请失败');
        }
    }
};

onMounted(() => {
    loadApplications();
});
</script>

<template>
    <div class="container">
        <div class="section-header">
            <div class="header-left">
                <h2 class="title">近期报名</h2>
                <el-radio-group v-model="activeTab" size="small" class="tab-group" @change="handleSearch">
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="0">待审核</el-radio-button>
                    <el-radio-button label="2">被拒绝</el-radio-button>
                    <el-radio-button label="3">已取消</el-radio-button>
                </el-radio-group>
            </div>
            <div class="header-right">
                <el-input v-model="searchText" placeholder="搜索列表..." :prefix-icon="Search" class="search-input" round @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            </div>
        </div>

        <!-- Application List -->
        <div class="application-list">
            <el-card v-for="app in applications" :key="app.id" class="application-card"
                :style="{ borderLeft: `4px solid ${statusMap[app.status]?.color}` }" shadow="hover">
                <div class="card-content">
                    <div class="app-info">
                        <el-image :src="getImageUrl(app.avatar)" class="app-logo" fit="cover">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                        <div class="app-details">
                            <h3 class="app-name">{{ app.clubName }}</h3>
                            <div class="app-meta">
                                <span class="meta-item">
                                    <el-icon>
                                        <User />
                                    </el-icon> {{ app.userName }}
                                </span>
                                <span class="meta-item">
                                    <el-icon>
                                        <Calendar />
                                    </el-icon> {{ app.createTime }}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="app-note">
                        {{ app.applyNote }}
                    </div>

                    <div class="app-status">
                        <div class="status-info">
                            <el-tag :type="statusMap[app.status]?.type" round effect="light" class="status-tag">
                                {{ statusMap[app.status]?.label }}
                            </el-tag>
                        </div>
                        <div class="app-actions">
                            <el-button v-if="app.status === '0'" type="danger" link
                                class="cancel-btn" @click="handleCancel(app.id)">取消申请</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- Pagination -->
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSearch"
                @current-change="loadApplications"
            >
                <template #total>
                    <span class="custom-total">Total {{ total }}</span>
                </template>
                <template #sizes>
                    <el-select v-model="pageSize" class="custom-sizes" @change="handleSearch" style="width: 100px;">
                        <el-option v-for="item in [10, 20, 30, 50]" :key="item" :label="item + '/page'" :value="item" />
                    </el-select>
                </template>
                <template #jumper>
                    <span class="custom-jumper">Go to <el-input v-model.number="currentPage" class="jumper-input" @change="loadApplications" /></span>
                </template>
            </el-pagination>
        </div>

    </div>
</template>

<style lang="less" scoped>
.container {
    padding: 24px;
    min-height: 100vh;
    font-family: 'Be Vietnam Pro', sans-serif;
}


.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .title {
            font-size: 20px;
            font-weight: 700;
            color: #2d2f33;
        }

        .tab-group {
            background-color: #f0f0f6;
            padding: 4px;
            border-radius: 8px;

            :deep(.el-radio-button__inner) {
                border: none;
                background: transparent;
                box-shadow: none;
                font-weight: 700;
                color: #5a5b60;
                border-radius: 6px;
                padding: 6px 16px;
            }

            :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
                background-color: #fff;
                color: #0058bb;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
        }
    }

    .search-input {
        width: 240px;

        :deep(.el-input__wrapper) {
            background-color: #fff;
            box-shadow: none;
            border-radius: 20px;
            padding-left: 12px;
        }
    }
}

.application-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .application-card {
        border-radius: 16px;
        border: none;
        transition: all 0.3s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        }

        :deep(.el-card__body) {
            padding: 20px;
        }

        .card-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .app-info {
            display: flex;
            align-items: center;
            gap: 24px;

            .app-logo {
                width: 64px;
                height: 64px;
                border-radius: 12px;
                background-color: #f0f0f6;
                display: flex;
                justify-content: center;
                align-items: center;

                .image-slot {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    color: #909399;
                    font-size: 24px;
                }
            }

            .app-details {
                .app-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2d2f33;
                    margin-bottom: 4px;
                }

                .app-meta {
                    display: flex;
                    gap: 16px;

                    .meta-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 14px;
                        color: #5a5b60;
                        font-weight: 500;

                        .el-icon {
                            font-size: 16px;
                        }
                    }
                }
            }
        }

        .app-status {
            display: flex;
            align-items: center;
            gap: 32px;

            .status-info {
                text-align: right;

                .status-tag {
                    font-weight: 700;
                    padding: 0 16px;
                    height: 28px;
                }

                .status-msg {
                    font-size: 10px;
                    color: #22c55e;
                    margin-top: 4px;
                    font-weight: 500;
                }
            }

            .app-actions {
                .cancel-btn {
                    font-weight: 700;
                    font-size: 14px;
                }

                .close-btn {
                    color: #acadb1;

                    &:hover {
                        color: #ef4444;
                        background-color: #fff1f0;
                    }
                }
            }
        }

        .app-note {
            flex: 1;
            margin: 0 40px;
            font-size: 14px;
            color: #22c55e;
            font-weight: 600;
            text-align: center;
        }
    }
}

.pagination-container {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    :deep(.el-pagination) {
        .el-select {
            margin: 0 16px;
        }
        
        .custom-total {
            color: #606266;
            margin-right: 16px;
        }

        .custom-jumper {
            display: flex;
            align-items: center;
            color: #606266;
            margin-left: 16px;

            .jumper-input {
                width: 50px;
                margin-left: 8px;
                
                .el-input__wrapper {
                    padding: 0 8px;
                    text-align: center;
                }
                
                .el-input__inner {
                    text-align: center;
                }
            }
        }
    }
}
</style>
