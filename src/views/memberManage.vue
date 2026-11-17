<template>
    <div class="main-content">
        <!-- 静态内容部分：统计卡片 -->
        <el-row :gutter="24" class="stats-grid">
            <el-col :span="8" v-for="item in stats" :key="item.label">
                <stat-card :label="item.label" :value="item.value" :icon="item.icon" />
            </el-col>
        </el-row>

        <div class="section-header">
            <h2 class="title">我的社团</h2>
            <p class="subtitle">这里是您负责或加入的社团列表</p>
        </div>

        <!-- 动态内容：调接口获取社团 -->
        <div v-if="loading" class="loading-state">
            <el-skeleton animated :rows="5" />
        </div>
        <div v-else-if="myClubs.length === 0" class="empty-state">
            <el-empty description="你还没有加入任何社团">
                <p class="empty-tip">加入社团后就能在这里看到你参与的社团啦</p>
                <el-button type="primary" round @click="goToClubSearch">去社团浏览</el-button>
            </el-empty>
        </div>
        <div v-else class="club-grid">
            <el-card shadow="hover" class="club-card" v-for="club in myClubs" :key="club.id">
                <div class="card-image">
                    <el-image :src="getRealImageUrl(club.avatar)" fit="cover" class="club-img">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><Picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                    <el-tag class="category-tag" size="small" type="primary" effect="dark">
                        {{ getLabel(Number(club.category)) }}
                    </el-tag>
                </div>
                <div class="card-content">
                    <h3 class="club-title">{{ club.clubName }}</h3>
                    <p class="club-desc" :title="club.description">{{ club.description || '暂无简介' }}</p>
                    <div class="club-meta">
                        <div class="meta-item">
                            <el-icon><User /></el-icon>
                            <span>负责人: {{ club.managerName }}</span>
                        </div>
                        <div class="meta-item">
                            <el-icon><Avatar /></el-icon>
                            <span>社团成员数: {{ club.size || 0 }}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <el-button type="primary" plain round size="small" @click="goToManage(club.id)">查看详情</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import statCard from '@/components/statCard.vue';
import { getMyClubListApi } from '@/api/club';
import { getLabel } from '@/utils/ClubCateMap';
import { Picture, User, Avatar } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const loading = ref(true);
const myClubs = ref<any[]>([]);

// 静态统计内容
const stats = ref([
    { label: '我的社团总数', value: '0', icon: 'StarFilled' },
    { label: '累计参与活动', value: '24', icon: 'TrendCharts' },
    { label: '本月社团积分', value: '150', icon: 'Medal' },
]);

// 获取用户的社团列表
const fetchMyClubs = async () => {
    loading.value = true;
    try {
        const res: any = await getMyClubListApi();
        if (res && res.code === 200) {
            myClubs.value = res.data || [];
            // 更新静态统计中的“我的社团总数”
            stats.value[0].value = myClubs.value.length.toString();
        } else {
            ElMessage.error(res?.message || '获取社团失败');
        }
    } catch (error) {
        console.error('获取社团信息失败', error);
        ElMessage.error('获取社团信息失败');
    } finally {
        loading.value = false;
    }
};

// 提取真实图片地址
const getRealImageUrl = (url: string) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        const mediaurl = urlObj.searchParams.get('mediaurl');
        if (mediaurl) return decodeURIComponent(mediaurl);
    } catch (e) {
        // 如果不是有效的带参数URL，直接返回原图
    }
    return url;
};

// 点击查看详情
const goToManage = (id: number) => {
    router.push({ path: '/clubMembers', query: { id: id.toString() } }); 
};

// 没有社团时，引导去社团浏览页加入社团
const goToClubSearch = () => {
    router.push('/clubSearch');
};

onMounted(() => {
    fetchMyClubs();
});
</script>

<style lang="less" scoped>
.main-content {
    max-width: 1642px;
    margin: 0 auto;
    padding: 24px;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
    background-color: #f6f6fb;
}

.stats-grid {
    margin-bottom: 32px;
}

.section-header {
    margin-bottom: 24px;
    .title {
        font-size: 24px;
        font-weight: 700;
        color: #2d2f33;
        margin: 0 0 8px 0;
    }
    .subtitle {
        font-size: 14px;
        color: #8c8e93;
        margin: 0;
    }
}

.club-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.club-card {
    border-radius: 16px;
    border: none;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: #fff;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 88, 187, 0.1);
    }

    :deep(.el-card__body) {
        padding: 0;
    }

    .card-image {
        position: relative;
        height: 180px;
        width: 100%;
        background-color: #f0f2f5;
        
        .club-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            color: #909399;
            font-size: 32px;
        }

        .category-tag {
            position: absolute;
            top: 16px;
            right: 16px;
            border-radius: 8px;
            font-weight: 600;
        }
    }

    .card-content {
        padding: 20px;

        .club-title {
            margin: 0 0 12px;
            font-size: 18px;
            font-weight: 700;
            color: #2d2f33;
        }

        .club-desc {
            margin: 0 0 16px;
            font-size: 14px;
            color: #5a5b60;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 42px; /* 固定高度保证对齐 */
        }

        .club-meta {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 20px;

            .meta-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #8c8e93;

                .el-icon {
                    color: #0058bb;
                }
            }
        }

        .card-actions {
            display: flex;
            justify-content: flex-end;
        }
    }
}

.loading-state, .empty-state {
    padding: 40px 0;
}

.empty-state {
    background: #fff;
    border-radius: 16px;

    .empty-tip {
        margin: 0 0 16px;
        font-size: 14px;
        color: #8c8e93;
    }
}
</style>
