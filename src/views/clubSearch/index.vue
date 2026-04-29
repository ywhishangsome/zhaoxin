<script setup lang="ts">
import HeroSection from './HeroSection.vue';
import clubDetail from './clubDetail.vue';
import { onMounted, ref } from 'vue';
import SignUpDialog from './signUpDialog.vue';
import { getClubListApi } from '@/api/club';
import { Search } from '@element-plus/icons-vue'
import { getLabel } from '@/utils/ClubCateMap';
// 定义俱乐部类型
interface Club {
    id: number
    clubName: string
    avatar: string
    size: number
    description: string
    managerName: string
    category: number

}

const clubs = ref<Club[]>([]);
const originalClubs = ref<Club[]>([]);
const clubId = ref<number>(0)
const showDetailDialog = ref<boolean>(false)
const handleDetail = (id: number) => {
    clubId.value = id
    showDetailDialog.value = true
    // console.log(showDetailDialog.value);
    // console.log(id);
}
const showSignDialog = ref<boolean>(false)
const handleSign = () => {
    showSignDialog.value = true
}

const getClubList = async () => {
    const res = await getClubListApi()
    // console.log(res);
    clubs.value = res.data
    originalClubs.value = res.data


}

onMounted(() => {
    getClubList()
})
// 提取真实图片地址
function getRealImageUrl(url: string) {
    if (!url) return ''
    // 从链接里解析出 mediaurl 参数（真实图片）
    const params = new URLSearchParams(url.split('?')[1])
    return params.get('mediaurl') || url
}

const categories = ['全部', '体育运动', '学术科技', '文娱艺术', '公益服务', '思想政治', '其他'];
const activeCategory = ref('全部');
const handleFiliter = (category: string) => {
    activeCategory.value = category;
    searchParams.value = ''
    // console.log(activeCategory.value);
    if (category === '全部') return clubs.value = originalClubs.value
    else if (category !== '全部') {
        clubs.value = originalClubs.value.filter(club => getLabel(club.category) === category)
    }
}

// 搜索功能
const searchParams = ref('');
const handleSearch = () => {
    activeCategory.value = '全部';
    if (searchParams.value === '') {
        clubs.value = originalClubs.value
    } else {
        clubs.value = originalClubs.value.filter(club => club.clubName.includes(searchParams.value))
    }
}
</script>

<template>
    <div class="main-content">
        <HeroSection />
        <div class="filters-area">
            <div class="category-chips">
                <button v-for="cat in categories" :key="cat" :class="['chip', { active: activeCategory === cat }]"
                    @click="handleFiliter(cat)">
                    {{ cat }}
                </button>
            </div>

            <div class="search-box">
                <el-icon class="search-icon" @click="handleSearch">
                    <Search />
                </el-icon>
                <input type="text" placeholder="搜索你感兴趣的社团..." v-model="searchParams" @keyup.enter="handleSearch" />
            </div>
        </div>
        <div v-if="!clubs.length" style="display: flex; justify-content: center; align-items: center; ">
            <el-empty description="暂无相关内容" />
        </div>
        <div v-else class="club-grid">

            <!-- 卡片容器 -->
            <el-card class="club-card" shadow="hover" v-for="club in clubs" :key="club.id">

                <!-- 图片区域 -->
                <div class="card-image">

                    <el-image :src="getRealImageUrl(club.avatar)" class="club-img" />
                    <el-tag class="category-tag" size="small">{{ getLabel(club.category) }}</el-tag>
                </div>

                <!-- 内容区域 -->
                <div class="card-content">
                    <h3 class="title">{{ club.clubName }}</h3>


                    <!-- 统计信息 -->
                    <div class="stats">
                        <div class="stat">
                            <el-icon :size="18">
                                <User />
                            </el-icon>
                            <span>{{ club.size }} 成员</span>
                        </div>
                        <div class="stat">
                            <el-icon :size="18">
                                <Star />
                            </el-icon>
                            <span>{{ getLabel(club.category) }}</span>

                        </div>
                        <div class="stat">
                            <el-icon :size="18">
                                <Phone />
                            </el-icon>
                            <span>{{ `${club.managerName}社长` }}</span>

                        </div>
                    </div>

                    <!-- 按钮区域 -->
                    <div class=" actions">
                        <el-button type="primary" class="details-btn" @click="handleDetail(club.id)">查看详情</el-button>
                        <el-button class="join-btn" @click="handleSign" circle>
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>


                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <clubDetail :dialogVisible="showDetailDialog" @close="showDetailDialog = false" :id="clubId" />
    <SignUpDialog :dialogVisible="showSignDialog" @close="showSignDialog = false" />

</template>

<style lang="less" scoped>
.main-content {
    flex: 1;
    padding: 12px 24px;
    margin: 0 auto;

    @media (max-width: 768px) {
        margin-left: 0;
    }
}

.filters-area {

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    margin-bottom: 40px;
    overflow: hidden;

    @media (max-width: 1024px) {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .category-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        flex-shrink: 0;

        .chip {
            padding: 8px 20px;
            border-radius: 999px;
            border: none;
            background: #ffffff;
            color: #2d2f33;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

            &:hover {
                background: #f1f5f9;
            }

            &.active {
                background: #0058bb;
                color: #ffffff;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0, 88, 187, 0.2);
            }

            &:active {
                transform: scale(0.98);
            }
        }
    }

    .search-box {
        position: relative;
        flex: 0 0 300px;
        max-width: 300px;
        overflow: hidden;
        border-radius: 12px;

        @media (max-width: 1024px) {
            flex: 1 1 100%;
            max-width: 100%;
        }

        input {
            width: 100%;
            box-sizing: border-box;
            background: #ffffff;
            border: none;
            border-radius: 12px;
            padding: 12px 24px 12px 48px;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            outline: none;
            transition: box-shadow 0.2s;

            &:focus {
                box-shadow: 0 0 0 2px rgba(0, 88, 187, 0.2);
            }
        }

        .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 20px;
            z-index: 1;
        }
    }
}

.club-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 32px;
    margin-top: 40px;

    .club-card {
        --el-card-padding: 0;
        padding: 0 !important;
        background: #ffffff;
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 88, 187, 0.12) !important;

            .club-img {
                :deep(img) {
                    transform: scale(1.1);
                }
            }

            .title {
                color: #0058bb;
            }
        }

        // 覆盖 Element Plus 卡片默认样式
        :deep(.el-card__body) {
            padding: 0;
        }

        .card-image {
            position: relative;
            height: 192px;
            overflow: hidden;
            justify-content: space-between;

            .club-img {
                width: 100%;
                height: 100%;

                :deep(img) {
                    transition: transform 0.5s ease;
                }
            }

            .category-tag {
                position: absolute;
                top: 16px;
                left: 16px;
                background: rgba(224, 244, 253, 0.9) !important;
                color: #4a5d64 !important;
                border: none;
                padding: 4px 12px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        }

        .card-content {
            padding: 20px;

            .title {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 8px;
                transition: color 0.2s;
            }


            .stats {
                display: flex;
                gap: 16px;
                margin-bottom: 18px;

                .stat {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    width: 90px;
                    color: #94a3b8;
                    font-size: 12px;
                    font-weight: 500;
                }
            }

            .actions {
                display: flex;
                margin-top: 25px;
                align-items: center;
                justify-content: space-between;

                .details-btn {

                    padding: 10px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    --el-button-bg-color: #0058bb;
                    --el-button-hover-bg-color: #004ca4;
                    border: none;
                }

                .join-btn {

                    &:hover {
                        --el-button-hover-bg-color: #0058bb;
                        ;
                    }
                }



            }
        }
    }
}
</style>
