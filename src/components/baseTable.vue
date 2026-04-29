<template>
    <div class="base-table">
        <el-table :data="tableData" v-bind="$attrs" v-loading="loading">
            <el-table-column v-for="col in columns" :key="col.prop" :label="col.label" :prop="col.prop"
                :width="col.width" :align="col.align || 'center'">
                <template #default="scope">
                    <!-- 自动判断是否有插槽 -->
                    <slot v-if="$slots[col.prop]" :name="col.prop" v-bind="scope" />

                    <!-- 没有插槽就显示原值 -->
                    <span v-else>{{ scope.row[col.prop] }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
interface Column {
    label: string;
    prop: string;
    width?: string;
    align?: string;
}
defineProps({
    tableData: Array,
    columns: Array as () => Column[],
    loading: Boolean
})
</script>

<style scoped lang="less">
.base-table {
    --el-table-header-bg-color: rgba(240, 240, 246, 0.5);
    --el-table-header-text-color: #64748b;
    border-radius: 16px;
    margin-top: 16px;

    :deep(.el-table__header th) {
        background-color: #f8fafc;
        color: #64748b;
        font-size: 12px;
        font-weight: 800;
        padding: 16px 12px;
    }

    :deep(.el-table__row td) {
        padding: 16px 12px;
    }

    :deep(.el-table__row:hover) {
        background-color: #f8fafc !important;
    }
}
</style>