<template>
    <div class="content-area">
        <div class="dashboard-wrapper">
            <div class="main-content-flow">
                <section class="hero-section">
                    <div class="hero-content">
                        <h1 class="hero-title">{{ `欢迎回来，${name}` }}</h1>
                        <p class="hero-subtitle">开启你的精彩社团生活。在这里，发现志同道合的伙伴，探索无限可能的自我。</p>
                        <div class="hero-actions">
                            <button class="btn-primary">探索新社团</button>
                            <button class="btn-outline">了解详情</button>
                        </div>
                    </div>
                    <div class="hero-image-wrapper">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPux6yISKWgkNEHMV14nfRqrhAyDPyqoLX-kLxp5KUwsf7Z6wkGzv_gxIC_-ld-vsfdaXoedMCqQDK-2JvdLo-E-dmR8ntG8WtRyIVsAT4_quswE8JY8UHc-7OQfuQjxCMVXQReNHuT0Er2MKP6v_k1tv28h_P2VqFVC6qs5PxJHMOQwlwFMqvMGV7A-_XWCj4BcWDWTvBMoSxHIxROQR4mWjFNEk8FUXzBtyazgd5Z35NjhobG9w1H0FrE4LHaNNIGUxdXrxdCQc"
                            alt="Campus" referrerpolicy="no-referrer" class="hero-bg-img" />
                    </div>
                </section>



                <!-- Featured Clubs Section -->
                <section class="featured-section">
                    <div class="section-header">
                        <h2 class="section-title">{{ clubsTitle }}</h2>
                        <div class="nav-arrows">
                            <button class="arrow-btn" @click="handlePrevPage" :disabled="currentPage === 0" :class="{ disabled: currentPage === 0 }">
                                <el-icon><ArrowLeft /></el-icon>
                            </button>
                            <button class="arrow-btn" @click="handleNextPage" :disabled="currentPage >= Math.ceil(allClubs.length / pageSize) - 1" :class="{ disabled: currentPage >= Math.ceil(allClubs.length / pageSize) - 1 }">
                                <el-icon><ArrowRight /></el-icon>
                            </button>
                        </div>
                    </div>
                    <div class="club-grid">
                        <div v-for="club in clubs" :key="club.clubName" class="club-card-item kinetic-card">
                            <div class="club-card-image">
                                <img :src="getRealImageUrl(club.avatar)" :alt="club.clubName" referrerpolicy="no-referrer" class="club-img" />
                                <div class="club-category-tag">{{ getLabel(club.category) }}</div>
                            </div>
                            <div class="club-card-content">
                                <div class="club-card-header">
                                    <div class="club-card-icon">
                                        <el-icon>
                                            <component :is="getCategoryIcon(club.category)" />
                                        </el-icon>
                                    </div>
                                    <h3 class="club-name">{{ club.clubName }}</h3>
                                </div>
                                <p class="club-description">{{ club.description }}</p>
                                <button class="club-details-btn" @click="goToClubDetails(club.id)">查看详情</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Sidebar -->
            <aside class="right-sidebar">
                <!-- User Brief -->
                <div class="sidebar-widget user-brief kinetic-card">
                    <div class="user-avatar">
                        <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerpolicy="no-referrer" />
                    </div>
                    <div class="user-info">
                        <h4>{{ name }}</h4>
                        <!-- <p>2023级 · 计算机学院</p> -->
                        <p>{{ college }} · {{ major }}</p>
                    </div>
                    <div class="user-badges">
                        <span class="badge">活跃分子</span>
                        <span class="badge">技术达人</span>
                    </div>
                </div>

                <!-- Timeline Section -->
                <div class="sidebar-widget timeline-container">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <el-icon class="header-icon">
                                <TrendCharts />
                            </el-icon>
                            进展动态
                        </h3>
                        <a href="#" class="view-all-link">查看全部</a>
                    </div>
                    <div class="timeline-list">
                        <div v-for="(item, index) in timelineItems" :key="index" class="timeline-item">
                            <div class="timeline-dot" :class="{ 'is-active': index === 0 }"></div>
                            <div class="timeline-item-content">
                                <p class="timeline-item-title">{{ item.title }}</p>
                                <p class="timeline-item-meta">{{ item.meta }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upcoming Events -->
                <div class="sidebar-widget events-widget kinetic-card">
                    <div class="widget-header">
                        <h3 class="widget-title">
                            <el-icon class="header-icon">
                                <Calendar />
                            </el-icon>
                            我的日程
                        </h3>
                    </div>
                    <div class="event-list">
                        <div class="event-item">
                            <div class="event-date">
                                <span class="day">08</span>
                                <span class="month">4月</span>
                            </div>
                            <div class="event-info">
                                <h6>编程马拉松开幕式</h6>
                                <p>19:00 | 线上会议</p>
                            </div>
                        </div>
                        <div class="event-item">
                            <div class="event-date">
                                <span class="day">12</span>
                                <span class="month">4月</span>
                            </div>
                            <div class="event-info">
                                <h6>社团联合招新日</h6>
                                <p>09:00 | 操场南侧</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="sidebar-widget quick-actions">
                    <button class="action-btn">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        填写申请
                    </button>
                    <button class="action-btn secondary">
                        <el-icon>
                            <Message />
                        </el-icon>
                        咨询建议
                    </button>
                </div>
            </aside>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { getMyClubListApi, getClubListApi } from '@/api/club';
import { getLabel } from '@/utils/ClubCateMap';
import {
    TrendCharts,
    ArrowLeft,
    ArrowRight,
    Headset,
    Trophy,
    ChatLineRound,
    Calendar,
    Edit,
    Message,
    Operation
} from '@element-plus/icons-vue';

const router = useRouter();



const timelineItems = ref([
    { title: '吉他社 面试通知', meta: '明天 14:00 | 艺术活动中心 201' },
    { title: '篮球社 申请已受理', meta: '2小时前' },
    { title: '辩论队 正在初步筛选', meta: '昨天 18:30' }
]);

const clubsTitle = ref('热门社团推荐');
const allClubs = ref<any[]>([]);
const clubs = ref<any[]>([]);
const currentPage = ref(0);
const pageSize = 3;

const updateDisplayedClubs = () => {
    const start = currentPage.value * pageSize;
    const end = start + pageSize;
    clubs.value = allClubs.value.slice(start, end);
};

const handlePrevPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--;
        updateDisplayedClubs();
    }
};

const handleNextPage = () => {
    const maxPage = Math.ceil(allClubs.value.length / pageSize) - 1;
    if (currentPage.value < maxPage) {
        currentPage.value++;
        updateDisplayedClubs();
    }
};

const getRealImageUrl = (url: string) => {
    if (!url) return '';
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

const getCategoryIcon = (category: string | number) => {
    const label = getLabel(category);
    if (label.includes('艺术')) return Headset;
    if (label.includes('体育')) return Trophy;
    if (label.includes('学术') || label.includes('科技')) return ChatLineRound;
    return Operation;
};

const goToClubDetails = (id?: number) => {
    if (clubsTitle.value === '热门社团推荐') {
        router.push('/clubSearch');
    } else {
        router.push({ path: '/clubMembers', query: { id: id?.toString() } });
    }
};

onMounted(async () => {
    try {
        const myClubsRes = await getMyClubListApi();
        if (myClubsRes.code === 200 && myClubsRes.data && myClubsRes.data.length > 0) {
            clubsTitle.value = '我的社团';
            allClubs.value = myClubsRes.data;
        } else {
            clubsTitle.value = '热门社团推荐';
            const allClubsRes = await getClubListApi();
            if (allClubsRes.code === 200 && allClubsRes.data) {
                allClubs.value = allClubsRes.data;
            }
        }
        updateDisplayedClubs();
    } catch (error) {
        console.error('Failed to load clubs:', error);
    }
});

// 获取登录信息
const userStore = useUserStore();
const { id, college, major, name, phone, roleCodes, token, avatar, code } = userStore.userInfo


</script>

<style lang="less" scoped>
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600&display=swap');

/* Local Variables */
@primary-color: #0058bb;
@primary-container: #6c9fff;
@surface: #f6f6fb;
@surface-container-low: #f0f0f6;
@surface-container-lowest: #ffffff;
@on-surface: #2d2f33;
@on-surface-variant: #5a5b60;
@outline-variant: rgba(172, 173, 177, 0.15);
@font-headline: 'Plus Jakarta Sans', sans-serif;
@font-body: 'Be Vietnam Pro', sans-serif;
@border-radius-lg: 1.5rem;
@shadow-ambient: 0 8px 24px rgba(0, 88, 187, 0.06);

body {
    font-family: @font-body;
    background-color: @surface;
    color: @on-surface;
    -webkit-font-smoothing: antialiased;
    margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: @font-headline;
}

.kinetic-card {
    background-color: @surface-container-lowest;
    border-radius: @border-radius-lg;
    box-shadow: @shadow-ambient;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 88, 187, 0.1);
    }
}





.dashboard-wrapper {
    display: flex;
    gap: 2rem;
    flex-direction: column;

    @media (min-width: 1280px) {
        flex-direction: row;
    }
}

.main-content-flow {
    flex: 1;
    min-width: 0;
}

/* Hero Section Styles */
.hero-section {
    position: relative;
    overflow: hidden;
    border-radius: 2rem;
    background: linear-gradient(135deg, @primary-color, @primary-container);
    padding: 2rem;
    margin-bottom: 2rem;
    color: white;
    display: flex;
    align-items: center;
    min-height: 240px;

    @media (min-width: 768px) {
        padding: 3rem;
    }
}

.hero-content {
    position: relative;
    z-index: 10;
    max-width: 600px;

    .hero-title {
        font-size: 2.5rem;
        font-weight: 900;
        margin: 0 0 1rem;
        letter-spacing: -0.02em;
        color: white;
    }

    .hero-subtitle {
        font-size: 1.125rem;
        font-weight: 500;
        opacity: 0.9;
        margin-bottom: 2rem;
        line-height: 1.6;
    }
}

.hero-actions {
    display: flex;
    gap: 1rem;

    button {
        padding: 0.75rem 2rem;
        border-radius: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .btn-primary {
        background: white;
        color: @primary-color;
    }

    .btn-outline {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(8px);
    }
}

.hero-image-wrapper {
    position: absolute;
    right: -5%;
    top: -10%;
    width: 45%;
    height: 120%;
    opacity: 0.25;
    pointer-events: none;

    .hero-bg-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        transform: rotate(12deg);
    }
}



/* Featured Section */
.featured-section {
    margin-bottom: 2rem;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .section-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: @on-surface;
            margin: 0;
        }

        .nav-arrows {
            display: flex;
            gap: 0.5rem;

            .arrow-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 1px solid @outline-variant;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                cursor: pointer;
                transition: all 0.2s;

                &:hover:not(.disabled) {
                    border-color: @primary-color;
                    color: @primary-color;
                }

                &.disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            }
        }
    }
}

.club-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
}

.club-card-item {
    background: white;
    overflow: hidden;

    .club-card-image {
        height: 180px;
        position: relative;
        overflow: hidden;

        .club-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .club-category-tag {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.625rem;
            font-weight: 700;
            color: @primary-color;
            text-transform: uppercase;
        }
    }

    .club-card-content {
        padding: 1.5rem;

        .club-card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;

            .club-card-icon {
                width: 36px;
                height: 36px;
                border-radius: 0.5rem;
                background: rgba(0, 88, 187, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                color: @primary-color;
            }

            .club-name {
                font-size: 1.125rem;
                font-weight: 800;
                margin: 0;
            }
        }

        .club-description {
            font-size: 0.875rem;
            color: @on-surface-variant;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            height: 2.8rem;
            overflow: hidden;
        }

        .club-details-btn {
            width: 100%;
            padding: 0.75rem;
            background: @surface-container-low;
            color: @primary-color;
            border: none;
            border-radius: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background: @primary-color;
                color: white;
            }
        }
    }
}

/* Right Sidebar Styles */
.right-sidebar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: 1280px) {
        width: 380px;
        flex-shrink: 0;
    }
}

.sidebar-widget {
    padding: 1.5rem;

    .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;

        .widget-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 800;
            font-size: 1rem;
            margin: 0;
            color: @on-surface;

            .header-icon {
                color: @primary-color;
            }
        }

        .view-all-link {
            font-size: 0.75rem;
            font-weight: 700;
            color: @primary-color;
            text-decoration: none;
        }
    }
}

.user-brief {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    .user-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-bottom: 1rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .user-info {
        margin-bottom: 1rem;

        h4 {
            margin: 0 0 0.25rem;
            font-weight: 800;
        }

        p {
            margin: 0;
            font-size: 0.875rem;
            color: @on-surface-variant;
        }
    }

    .user-badges {
        display: flex;
        gap: 0.5rem;

        .badge {
            font-size: 0.625rem;
            font-weight: 700;
            padding: 0.25rem 0.5rem;
            background: rgba(0, 88, 187, 0.05);
            color: @primary-color;
            border-radius: 4px;
        }
    }
}

.timeline-container {
    background: @surface-container-low;
    border-radius: @border-radius-lg;

    .timeline-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .timeline-item {
        display: flex;
        gap: 1rem;

        .timeline-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #cbd5e1;
            margin-top: 6px;
            flex-shrink: 0;

            &.is-active {
                background: @primary-color;
            }
        }

        .timeline-item-title {
            font-size: 0.875rem;
            font-weight: 700;
            margin: 0 0 0.25rem;
        }

        .timeline-item-meta {
            font-size: 0.75rem;
            color: @on-surface-variant;
            margin: 0;
        }
    }
}

.events-widget {
    .event-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .event-item {
        display: flex;
        gap: 1rem;
        align-items: center;

        .event-date {
            width: 48px;
            height: 48px;
            background: @surface-container-low;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            .day {
                font-weight: 800;
                font-size: 1.125rem;
                line-height: 1;
            }

            .month {
                font-size: 0.625rem;
                font-weight: 700;
                color: @on-surface-variant;
            }
        }

        .event-info {
            h6 {
                margin: 0 0 0.25rem;
                font-weight: 700;
                font-size: 0.875rem;
            }

            p {
                margin: 0;
                font-size: 0.75rem;
                color: @on-surface-variant;
            }
        }
    }
}

.quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0;

    .action-btn {
        width: 100%;
        padding: 1rem;
        border-radius: 1rem;
        border: none;
        background: @primary-color;
        color: white;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            transform: scale(1.02);
        }

        &.secondary {
            background: white;
            color: @primary-color;
            border: 1px solid @outline-variant;
        }
    }
}
</style>