<script setup lang="ts">
import { ref, computed, reactive, unref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import statCard from '@/components/statCard.vue'
import { getUserListApi, updatePasswordApi, updateUserStatusApi, deleteUserApi } from '@/api/user'
import { useTable } from '@/hooks/useTable'
import baseTable from '@/components/baseTable.vue'
import { UserFilled } from '@element-plus/icons-vue'
interface User {
    id: string
    code: string
    name: string
    avatar: string
    college: string
    status: 1 | 0
    createTime: Date
    updateTime: Date
    description: string
    phone: string
    major: string
}




const searchParams = reactive({
    keyword: '',

})
const { totals, resetPage, handleSearch, handleCurrentChange, handleSizeChange, loadData, loading, pageInfo, tableData } = useTable<User[]>(getUserListApi, unref(searchParams))
console.log(tableData.value);


const stats = [
    { label: '用户总数', value: '12,482', },
    { label: '今日活跃', value: '1,894', },
    { label: '待审核注册', value: '43', },
    { label: '本周新增', value: '312', }
]

const columns = [
    { label: '头像', prop: 'avatar', width: '80px' },
    { label: '姓名', prop: 'name' },
    { label: '账号', prop: 'code' },
    { label: '电话', prop: 'phone' },
    { label: '学院', prop: 'college' },
    { label: '注册时间', prop: 'createTime' },
    { label: '状态', prop: 'status' },
    { label: '操作', prop: 'actions', width: '200px' },

]
const handleReset = () => {
    searchParams.keyword = ''
    resetPage()

}

const handleResetPassword = async (row: User) => {
    try {
        await ElMessageBox.confirm(`确定要重置用户 ${row.name || row.code} 的密码吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res: any = await updatePasswordApi({ id: row.id, type: 1 })
        if (res.code === 200) {
            ElMessage.success('重置密码成功')
        } else {
            ElMessage.error(res.message || '重置密码失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('重置密码请求失败')
        }
    }
}

const handleToggleStatus = async (row: User) => {
    try {
        const action = row.status === 1 ? '停用' : '启用'
        const targetStatus = row.status === 1 ? 0 : 1
        await ElMessageBox.confirm(`确定要${action}用户 ${row.name || row.code} 吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res: any = await updateUserStatusApi(row.id, targetStatus)
        if (res.code === 200) {
            ElMessage.success(`${action}成功`)
            loadData() // 刷新列表
        } else {
            ElMessage.error(res.message || `${action}失败`)
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('操作请求失败')
        }
    }
}

const handleDelete = async (row: User) => {
    try {
        await ElMessageBox.confirm(`确定要删除用户 ${row.name || row.code} 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger'
        })
        const res: any = await deleteUserApi(row.id)
        if (res.code === 200) {
            ElMessage.success('删除成功')
            loadData() // 刷新列表
        } else {
            ElMessage.error(res.message || '删除失败')
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除请求失败')
        }
    }
}
</script>

<template>
    <div class="main-content">
        <el-row class="stats-grid" :gutter="24">
            <el-col :span="6" v-for="item in stats" :key="item.label">
                <statCard :label="item.label" :value="item.value"> </statCard>
            </el-col>
        </el-row>


        <el-card shadow="never" class="table-card">
            <div class="table-filters">
                <el-form :inline="true" class="filter-form">
                    <el-form-item label="学号">
                        <el-input placeholder="请输入学号" v-model="searchParams.keyword"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="专业">
                        <el-input placeholder="请输入社团名称" v-model="searchParams"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchParams" placeholder="全部状态" style="width: 150px">
                            <el-option label="全部状态" value="" />
                            <el-option label="正常" value="1" />
                            <el-option label="停用" value="2" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="Search" round @click="handleSearch">查询</el-button>
                        <el-button icon="Delete" round @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-button type="primary" icon="Download" class="fr export-btn">导出报表</el-button>
            </div>
            <baseTable :columns="columns" :table-data="tableData" :loading="loading">
                <template #avatar='scope'>
                    <el-avatar :size="40" :src="scope.row.headUrl || 'https://tse3-mm.cn.bing.net/th/id/OIP-C.iRUwMzBoxV2U1y_zKl0bSQAAAA?w=149&h=180&c=7&r=0&o=7&pid=1.7&rm=3'">
                        <template #default>
                            <el-icon><UserFilled /></el-icon>
                        </template>
                    </el-avatar>
                </template>
                <template #status='scope'>
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' :
                        '停用' }}</el-tag>
                </template>

                <template #actions='scope'>
                    <div class="action-buttons">
                        <el-button type="primary" link size="small" @click="handleResetPassword(scope.row)">重置密码</el-button>
                        <el-button type="primary" link size="small" @click="handleToggleStatus(scope.row)">{{ scope.row.status === 1 ? '停用' : '启用' }}</el-button>
                        <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </div>
                </template>
            </baseTable>

            <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.limit"
                :page-sizes="[10, 20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper"
                :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                class="mt mb fr" />


            <el-button type="primary" class="fab-btn" circle>
                <el-icon class="icon-lg">
                    <Plus />
                </el-icon>
            </el-button>
        </el-card>

    </div>

</template>

<style lang="less" scoped>
.main-content {
    max-width: 1642px;
    margin: 0 auto;
    padding: 24px;

    min-height: 100vh;
    font-family: 'Be Vietnam Pro', sans-serif;
}


.stats-grid {
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

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
}

.fab-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 56px;
    height: 56px;
    box-shadow: 0 8px 24px rgba(0, 88, 187, 0.3);
    z-index: 100;

    :deep(.el-icon) {
        font-size: 24px;
    }
}
</style>
