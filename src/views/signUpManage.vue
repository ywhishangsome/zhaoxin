<template>
    <div class="content">
        <el-row :gutter="24" class="stats-row">
            <el-col :span="8" v-for="item in cardList" :key="item.label">
                <statCard :label="item.label" :value="item.value" :icon="item.icon" />
            </el-col>
        </el-row>

        <el-card shadow="never" class="table-card">
            <div class="table-filters">
                <el-form :inline="true" class="filter-form">
                    <el-form-item label="学生姓名">
                        <el-input placeholder="请输入学生姓名" v-model="searchParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label=" 审核状态">
                        <el-select v-model="searchParams.status" placeholder="全部状态" style="width: 150px">
                            <el-option label="全部状态" value="" />
                            <el-option label="待审核" value="0" />
                            <el-option label="通过" value="1" />
                            <el-option label="拒绝" value="2" />
                            <el-option label="取消" value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" round @click="handleSearch">查询</el-button>
                        <el-button icon="Delete" round @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-button type="primary" icon="Download" class="fr export-btn">导出报表</el-button>
            </div>

            <baseTable :tableData="tableData" :loading="loading" :columns="tableColoumn">
                <template #status="scope">
                    <el-tag v-if="scope.row.status === '0'" type="warning">待审核</el-tag>
                    <el-tag v-if="scope.row.status === '1'" type="success">通过</el-tag>
                    <el-tag v-if="scope.row.status === '2'" type="danger">拒绝</el-tag>
                    <el-tag v-if="scope.row.status === '3'" type="info">取消</el-tag>
                </template>

                <template #operation="scope">
                    <template v-if="scope.row.status === '0'">
                        <el-button type="success" size="small" @click="handlePass(scope.row)">通过</el-button>
                        <el-button type="danger" size="small" @click="handleReject(scope.row)">驳回</el-button>
                    </template>
                    <span v-else>-</span>
                </template>
            </baseTable>
            <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.limit"
                :page-sizes="[10, 20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper"
                :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                class="mt mb fr" />

        </el-card>
    </div>


</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from 'vue'
import statCard from '@/components/statCard.vue'
import { useTable } from '@/hooks/useTable'
import { getSignPageApi, auditApplyApi } from '@/api/sign';
import baseTable from '@/components/baseTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
interface SearchParams {
    status: string,
    name: string,
}
//顶部卡片数据
const cardList = [
    { label: '总报名人数', value: '1284', icon: 'UserFilled' },
    { label: '今日新增', value: '42', icon: 'TrendCharts' },
    { label: '待审核', value: '24', icon: 'Clock' }
]
//表格过滤
const searchParams = reactive<SearchParams>({
    status: '',
    name: '',
})
const { totals, resetPage, handleSearch, handleCurrentChange, handleSizeChange, loadData, loading, pageInfo, tableData } = useTable(getSignPageApi, searchParams)
// console.log("12", tableData.value);


// 表格列
const tableColoumn = [
    { label: "id", prop: 'id', width: '80px' },
    { label: "学生姓名", prop: 'userName' },
    { label: "申请社团", prop: 'clubName' },
    { label: "申请日期", prop: 'createTime' },
    { label: "个人介绍", prop: 'applyNote' },
    { label: "审核状态", prop: 'status' },
    { label: "操作", prop: 'operation', width: '300' }
]


const handleReset = () => {
    searchParams.status = ''
    searchParams.name = ''
    resetPage()

}
//查看详情
const handleDetail = (row: any) => {
    console.log(row)
}
//通过
const handlePass = async (row: any) => {
    try {
        await ElMessageBox.confirm('确定要通过该报名申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res: any = await auditApplyApi(row.id, 1)
        if (res && res.code === 200) {
            ElMessage.success('操作成功')
            loadData()
        } else {
            ElMessage.error(res?.message || '操作失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error(error)
            ElMessage.error('操作失败')
        }
    }
}
//驳回
const handleReject = async (row: any) => {
    try {
        await ElMessageBox.confirm('确定要驳回该报名申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res: any = await auditApplyApi(row.id, 2)
        if (res && res.code === 200) {
            ElMessage.success('操作成功')
            loadData()
        } else {
            ElMessage.error(res?.message || '操作失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            console.error(error)
            ElMessage.error('操作失败')
        }
    }
}

</script>

<style lang="less" scoped>
body {
    margin: 0;
    font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
    background-color: #f6f6fb;
    ;
    color: #2d2f33;
    ;
}

.content {
    padding: 24px;

    .stats-row {
        margin-bottom: 32px;
    }

    .table-card {
        border-radius: 16px;
        border: none;
        box-shadow: 0 8px 24px rgba(0, 88, 187, 0.06);



        .table-filters {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f0f0f6;

            .filter-form {
                font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
            }

        }


    }
}
</style>
