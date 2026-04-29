<template>
    <div class="home-container">
        <!-- 普通用户 -->
        <UserHome v-if="isIncludeRoles('STUDENT')" />

        <!-- 社团管理员 -->
        <ClubAdminHome v-else-if="isIncludeRoles('CLUBADMIN')" />

        <!-- 超级管理员 -->
        <SuperAdminHome v-else-if="isIncludeRoles('SYSTEMADMIN')" />

        <!-- 未知角色 -->
        <el-empty v-else description="暂无权限" />
    </div>
</template>

<script setup lang="ts">
import UserHome from './UserHome.vue'
import ClubAdminHome from './ClubAdminHome.vue'
import SuperAdminHome from './SuperAdminHome.vue'
import { useUserStore } from '@/store/user'

// 从 pinia 拿角色
const userStore = useUserStore()
const roles = userStore.userInfo.roleCodes
    || (sessionStorage.getItem("roleCodes") || "").split(",")
console.log(userStore.userInfo.roleCodes);
console.log(sessionStorage.getItem("roleCodes"));

console.log(roles);

const isIncludeRoles = (role: string) => {
    return roles.some((item) => item.includes(role))
}
console.log(isIncludeRoles('STUDENT'));


</script>

<style scoped lang="less">
.home-container {
    padding: 20px;
}
</style>