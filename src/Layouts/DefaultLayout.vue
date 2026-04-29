<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="230px">
                <Menu></Menu>
            </el-aside>
            <el-container>
                <el-header>
                    <TopHeader></TopHeader>
                </el-header>
                <el-main>

                    <MainBoard></MainBoard>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import MainBoard from '@/components/mainBoard.vue';
import Menu from '@/components/Menu.vue';
import TopHeader from '@/components/TopHeader.vue';

</script>


<style scoped lang="less">
.el-aside {
    background-color: white;
    height: 100vh;

}

.el-header {
    padding: 0 !important
}

.el-main {
    height: 80vh;
    overflow: auto;
}
</style>