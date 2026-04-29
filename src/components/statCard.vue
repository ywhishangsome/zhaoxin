<template>
    <el-card shadow="never" class="stat-card">
        <div class="stat-content">
            <div class="stat-info">
                <p class="stat-label">{{ props.label }}</p>
                <h3 class="stat-value">{{ props.value }}</h3>
            </div>
            <el-icon class="stat-icon">
                <component :is="props.icon"></component>
            </el-icon>
        </div>
    </el-card>
</template>
<script lang="ts" setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        //不是必须传
    }
}

)
</script>
<style lang="less" scoped>
.stat-card {
    border-radius: 16px;
    border: none;

    background-color: #ffffff;

    .stat-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .stat-label {
            font-size: 14px;
            color: #5a5b60;
            margin: 0 0 4px 0;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 800;
            margin: 0;
        }

        .stat-icon {
            font-size: 48px;
            color: rgba(0, 88, 187, 0.1);
        }
    }
}
</style>