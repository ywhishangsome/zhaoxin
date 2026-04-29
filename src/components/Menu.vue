<template>
    <div class="container" v-if="menu && menu.length">
        <div class="logo">
            <div>
                <img :src="logo" alt="" class="logo-icon">
            </div>
            <span class="logo-text">管理系统</span>
        </div>
        <el-menu :default-active="$route.path" class="menu" :router="true">

            <el-menu-item :index="item.path" v-for="item in menu" :key="item.path" class="menu-item">
                <template #title>

                    <el-icon>
                        <component :is="item.icon" class="icon"></component>
                    </el-icon>
                    <span clsss="title">{{ item.title }}</span>
                </template>
            </el-menu-item>
        </el-menu>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import logo from '@/assets/logo.png'
import type { MenuItem } from '@/type'
import { menuList } from '../config/menu'
import { useUserStore } from '@/store/user';
const userStore = useUserStore()

const menu = ref<MenuItem[]>([])

const filterMenus = () => {
    let userRole = ''
    if (userStore.userInfo.roleCodes?.length) {
        userRole = userStore.userInfo.roleCodes[0]!
    }
    else {
        const roleStr = sessionStorage.getItem('roleCodes') || ''
        const roleArr = roleStr.split(',').map(item => item.trim())
        userRole = roleArr[0] || ''
    }
    // 3. 过滤菜单
    menu.value = menuList.filter(item => {
        if (!item.roles || item.roles.length === 0) return true
        return item.roles.includes(userRole)
    })
}

// 保证页面刷新不丢失
watch(
    () => userStore.userInfo,
    () => filterMenus(),
    { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.container {
    height: 100%;


    .logo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 40px;
        margin-bottom: 20px;

        .logo-icon {
            border: 1px solid #e5e7eb;
            border-radius: 50%
        }

        .logo-text {
            height: 60px;
            line-height: 60px;
            font-size: 20px
        }

    }

    .menu {
        .menu-item {
            padding-left: 40px;
            border-radius: 14px;
        }
    }

}

.el-menu-item.is-active {
    background-color: #EDF0FF;
}

.el-menu {
    border-right: none;
}
</style>