<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import statCard from '@/components/statCard.vue';
import baseTable from '@/components/baseTable.vue';
import { getClubPageApi, addClubApi, updateClubApi, deleteClubApi } from '@/api/club';
import { useTable } from '@/hooks/useTable';

const searchParams = reactive({
    name: '',
    leader: '',
    category: ''

})


import { useRouter } from 'vue-router'

const router = useRouter()
const { totals, resetPage, handleSearch, handleCurrentChange, handleSizeChange, loadData, loading, pageInfo, tableData } = useTable(getClubPageApi, searchParams)

// 跳转到管理人员页面
const handleManageMembers = (row: any) => {
    router.push({ path: '/clubMembers', query: { id: row.id.toString() } })
}



const stats = [
    { label: '总社团数', value: '124', icon: 'UserFilled' },
    {
        label: '活跃成员', value: '3280', icon: 'UserFilled'
    },
    { label: '待审批申请', value: '7', icon: 'TrendCharts' },
    { label: '社团活跃率', value: '92%', icon: 'View' }
]




// 表格列
const columns = [
    { label: '社团ID', prop: 'id' },
    { label: '社团名称', prop: 'clubName' },
    { label: '社团负责人', prop: 'managerName' },
    { label: '状态', prop: 'status' },
    { label: '类别', prop: 'category' },
    { label: '成立时间', prop: 'createTime' },
    { label: '人数', prop: 'size' },
    { label: '操作', prop: 'actions', width: '220px' },

];
const handleReset = () => {
    searchParams.name = ''
    searchParams.leader = ''
    searchParams.category = ''
    resetPage()


}

// 添加与编辑社团相关的状态
const dialogVisible = ref(false)
const dialogTitle = ref('添加社团')
const formRef = ref<FormInstance>()
const isEdit = ref(false)

const clubForm = reactive({
    id: 0,
    clubName: '',
    description: '',
    avatar: '',
    category: undefined as number | undefined
})

const rules = reactive<FormRules>({
    clubName: [{ required: true, message: '请输入社团名称', trigger: 'blur' }],
    description: [{ required: true, message: '请输入社团描述', trigger: 'blur' }],
    avatar: [{ required: true, message: '请输入社团头像网址', trigger: 'blur' }],
    category: [{ required: true, message: '请选择社团类别', trigger: 'change' }]
})

// 处理添加社团
const handleAddClub = () => {
    dialogTitle.value = '添加社团'
    isEdit.value = false
    Object.assign(clubForm, {
        id: 0,
        clubName: '',
        description: '',
        avatar: '',
        category: undefined
    })
    dialogVisible.value = true
    nextTick(() => {
        formRef.value?.clearValidate()
    })
}

// 处理编辑社团
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑社团'
    isEdit.value = true
    Object.assign(clubForm, {
        id: row.id,
        clubName: row.clubName,
        description: row.description,
        avatar: row.avatar,
        category: Number(row.category)
    })
    dialogVisible.value = true
    nextTick(() => {
        formRef.value?.clearValidate()
    })
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                const apiCall = isEdit.value ? updateClubApi : addClubApi
                const res: any = await apiCall(clubForm)
                
                if (res.code === 200) {
                    ElMessage.success(`${isEdit.value ? '修改' : '添加'}成功`)
                    dialogVisible.value = false
                    loadData() // 刷新列表
                } else {
                    ElMessage.error(res.message || `${isEdit.value ? '修改' : '添加'}失败`)
                }
            } catch (error) {
                ElMessage.error(`${isEdit.value ? '修改' : '添加'}请求失败`)
            }
        }
    })
}

// 处理删除社团
const handleDelete = async (row: any) => {
    try {
        await ElMessageBox.confirm(`确定要删除社团 ${row.clubName} 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'danger'
        })
        const res: any = await deleteClubApi(row.id)
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
        <!-- Stats Cards -->
        <el-row :gutter="24" class="stats-grid">
            <el-col :span="6" v-for="stat in stats" :key="stat.label">
                <stat-card :label="stat.label" :value="stat.value" :icon="stat.icon" />
            </el-col>
        </el-row>


        <el-card shadow="never" class="table-card">
            <div class="table-filters">
                <el-form :inline="true" class="filter-form">
                    <el-form-item label="社团名称">
                        <el-input placeholder="请输入社团名称" v-model="searchParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人">
                        <el-input placeholder="请输入负责人姓名" v-model="searchParams.leader"></el-input>
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-select v-model="searchParams.category" placeholder="全部类别" style="width: 150px">
                            <el-option label="全部类别" value="" />
                            <el-option label="体育运动" value="1" />
                            <el-option label="学术科技" value="2" />
                            <el-option label="文娱艺术" value="3" />
                            <el-option label="公益服务" value="4" />
                            <el-option label="思想政治" value="5" />
                            <el-option label="其他" value="6" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" round @click="handleSearch">查询</el-button>
                        <el-button icon="Delete" round @click="handleReset"> 重置</el-button>
                    </el-form-item>
                </el-form>

                <div class="header-actions fr">
                    <el-button type="primary" icon="Plus" @click="handleAddClub">添加社团</el-button>
                    <el-button type="primary" icon="Download" class="export-btn">导出报表</el-button>
                </div>
            </div>

            <baseTable :columns="columns" :table-data="tableData" :loading="loading">
                <template #id="scope">
                    {{ (pageInfo.page - 1) * pageInfo.limit + scope.$index + 1 }}
                </template>
                <template #category="scope">
                    <el-tag v-if="scope.row.category === 1" type="success">体育运动</el-tag>
                    <el-tag v-else-if="scope.row.category === 2" type="warning">学术科技</el-tag>
                    <el-tag v-else-if="scope.row.category === 3" type="danger">文娱艺术</el-tag>
                    <el-tag v-else-if="scope.row.category === 4" type="info">公益服务</el-tag>
                    <el-tag v-else-if="scope.row.category === 5" type="primary">思想政治</el-tag>
                    <el-tag v-else>其他</el-tag>
                </template>
                <template #actions="scope">
                    <div class="action-buttons">
                        <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" link size="small" @click="handleManageMembers(scope.row)">管理人员</el-button>
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

    <!-- 添加/编辑社团弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
        <el-form ref="formRef" :model="clubForm" :rules="rules" label-width="100px">
            <el-form-item label="社团名称" prop="clubName">
                <el-input v-model="clubForm.clubName" placeholder="请输入社团名称"></el-input>
            </el-form-item>
            <el-form-item label="社团描述" prop="description">
                <el-input v-model="clubForm.description" type="textarea" :rows="3" placeholder="请输入社团描述"></el-input>
            </el-form-item>
            <el-form-item label="社团头像" prop="avatar">
                <el-input v-model="clubForm.avatar" placeholder="请输入社团头像网址"></el-input>
                <div v-if="clubForm.avatar" class="avatar-preview mt-2">
                    <el-image :src="clubForm.avatar" style="width: 100px; height: 100px" fit="cover"></el-image>
                </div>
            </el-form-item>
            <el-form-item label="社团类别" prop="category">
                <el-select v-model="clubForm.category" placeholder="请选择社团类别" style="width: 100%">
                    <el-option label="体育运动" :value="1" />
                    <el-option label="学术科技" :value="2" />
                    <el-option label="文娱艺术" :value="3" />
                    <el-option label="公益服务" :value="4" />
                    <el-option label="思想政治" :value="5" />
                    <el-option label="其他" :value="6" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="less" scoped>
.main-content {
    max-width: 1642px;
    margin: 0 auto;
    padding: 24px;

    min-height: 100vh;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.avatar-preview {
    margin-top: 8px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #dcdfe6;
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