<template>
    <div class="header-container">
        <div class="header-left">

            <span class="header-title">{{ topTitle || '首页' }}</span>
        </div>
        <div class="header-right">
            <div class="status-tag">
                <span class="status-dot online"></span>
                <span>系统正常运行中</span>
            </div>
            <el-button @click="handleLogout">退出登录</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { menuList } from '@/config/menu'
import { useUserStore } from '@/store/user';

const route = useRoute();
// console.log(route.name);
const topTitle = ref<string | undefined>('')

watch(() => route.name, () => {
    topTitle.value = findTitle(route.name?.toString())
})
const findTitle = (name: string | undefined) => {
    return menuList.find(item => item.path === `/${name}`)?.title
}
const userStore = useUserStore()
const router = useRouter()
const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}

</script>

<style scoped>
.header-container {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-icon {
    cursor: pointer;
    color: #6b7280;
    font-size: 20px;
}

.header-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.status-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: #f3f4f6;
    border-radius: 12px;
    font-size: 13px;
    color: #374151;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot.online {
    background: #22c55e;
}

.theme-icon {
    cursor: pointer;
    color: #6b7280;
    font-size: 20px;
}
</style>