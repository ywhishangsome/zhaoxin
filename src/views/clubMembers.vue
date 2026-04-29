<template>
    <div class="main-content">
        <el-card shadow="never" class="table-card">
            <div class="table-header">
                <div class="header-left">
                    <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
                    <span class="title">社团成员列表</span>
                </div>
                <div class="header-right" v-if="userStore.userInfo?.roleCodes?.includes('SYSTEMADMIN')">
                    <el-button type="primary" icon="Plus" @click="handleAddMember">添加人员</el-button>
                </div>
            </div>

            <baseTable :columns="columns" :table-data="tableData" :loading="loading">
                <template #headUrl="scope">
                    <el-avatar :size="40" :src="getRealImageUrl(scope.row.headUrl)">
                        <template #default>
                            <el-icon><UserFilled /></el-icon>
                        </template>
                    </el-avatar>
                </template>
                <template #roleType="scope">
                    <el-tag :type="getRoleTypeTag(scope.row.roleType)" effect="light">
                        {{ getRoleTypeName(scope.row.roleType) }}
                    </el-tag>
                </template>
                <template #actions="scope">
                    <el-button
                        v-if="userStore.userInfo?.roleCodes?.includes('SYSTEMADMIN')"
                        type="danger"
                        link
                        size="small"
                        @click="handleDeleteMember(scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </baseTable>

            <el-pagination 
                v-model:current-page="pageInfo.page" 
                v-model:page-size="pageInfo.limit"
                :page-sizes="[10, 20, 30, 40]" 
                background 
                layout="total, sizes, prev, pager, next, jumper"
                :total="totals" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                class="mt mb fr" />
        </el-card>

        <!-- 添加人员弹窗 -->
        <el-dialog v-model="addDialogVisible" title="添加社团成员" width="500px" @close="resetAddForm">
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
                <el-form-item label="选择用户" prop="userId">
                    <el-select
                        v-model="addForm.userId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入姓名搜索并选择用户"
                        :remote-method="remoteMethod"
                        :loading="searchLoading"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in userOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                                ID: {{ item.id }}
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色分配" prop="roleType">
                    <el-select v-model="addForm.roleType" placeholder="请选择角色" style="width: 100%">
                        <el-option label="社长" :value="1" />
                        <el-option label="管理员" :value="2" />
                        <el-option label="成员" :value="3" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitAddMember" :loading="submitLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import baseTable from '@/components/baseTable.vue';
import { getClubUserListApi, addClubUserApi, deleteClubUserApi } from '@/api/club';
import { getAllUserIdAndNameApi } from '@/api/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { UserFilled, ArrowLeft } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const clubId = route.query.id as string;

const loading = ref(false);
const tableData = ref<any[]>([]);
const totals = ref(0);
const pageInfo = ref({
    page: 1,
    limit: 10
});

const columns = [
    { label: '头像', prop: 'headUrl', width: '80px' },
    { label: '账号', prop: 'code' },
    { label: '姓名', prop: 'name' },
    { label: '学院', prop: 'college' },
    { label: '专业', prop: 'major' },
    { label: '电话', prop: 'phone' },
    { label: '角色', prop: 'roleType' },
    { label: '操作', prop: 'actions', width: '100px' },
];

const loadData = async () => {
    if (!clubId) {
        ElMessage.warning('缺少社团ID参数');
        return;
    }
    
    loading.value = true;
    try {
        const res: any = await getClubUserListApi(pageInfo.value.page, pageInfo.value.limit, clubId);
        if (res && res.code === 200) {
            tableData.value = res.data.records || [];
            totals.value = res.data.total || 0;
        } else {
            ElMessage.error(res?.message || '获取成员列表失败');
        }
    } catch (error) {
        console.error('获取成员列表失败', error);
        ElMessage.error('获取成员列表异常');
    } finally {
        loading.value = false;
    }
};

const handleSizeChange = (val: number) => {
    pageInfo.value.limit = val;
    pageInfo.value.page = 1;
    loadData();
};

const handleCurrentChange = (val: number) => {
    pageInfo.value.page = val;
    loadData();
};

// 提取真实图片地址
const getRealImageUrl = (url: string) => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        const mediaurl = urlObj.searchParams.get('mediaurl');
        if (mediaurl) return decodeURIComponent(mediaurl);
    } catch (e) {
        // Not a valid URL with mediaurl parameter
    }
    return url;
};

// 角色类型映射: 1是社长，2是管理员，3是成员
const getRoleTypeName = (roleType: string | number) => {
    const type = String(roleType);
    switch (type) {
        case '1': return '社长';
        case '2': return '管理员';
        case '3': return '成员';
        default: return '未知角色';
    }
};

// 角色类型标签颜色
const getRoleTypeTag = (roleType: string | number) => {
    const type = String(roleType);
    switch (type) {
        case '1': return 'danger'; // 社长红色
        case '2': return 'warning'; // 管理员橙色
        case '3': return 'info'; // 成员灰色
        default: return '';
    }
};

const handleAddMember = () => {
    addDialogVisible.value = true;
    remoteMethod(''); // 打开弹窗时默认获取全部用户列表
};

// 删除社团成员
const handleDeleteMember = (row: any) => {
    ElMessageBox.confirm(
        `确定要将成员 "${row.name}" 从社团中移除吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                const res: any = await deleteClubUserApi(row.id, clubId);
                if (res && res.code === 200) {
                    ElMessage.success('删除成功');
                    loadData(); // 刷新列表
                } else {
                    ElMessage.error(res?.message || '删除失败');
                }
            } catch (error) {
                console.error('删除成员失败', error);
                ElMessage.error('删除成员异常');
            }
        })
        .catch(() => {
            ElMessage.info('已取消删除');
        });
};

// --- 添加人员表单及逻辑 ---
const addDialogVisible = ref(false);
const addFormRef = ref<FormInstance>();
const searchLoading = ref(false);
const submitLoading = ref(false);
const userOptions = ref<any[]>([]);

const addForm = reactive({
    userId: '',
    roleType: 3
});

const addRules = reactive<FormRules>({
    userId: [{ required: true, message: '请搜索并选择用户', trigger: 'change' }],
    roleType: [{ required: true, message: '请选择角色', trigger: 'change' }]
});

// 重置表单
const resetAddForm = () => {
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }
    userOptions.value = [];
};

// 远程搜索用户
const remoteMethod = async (query: string) => {
    searchLoading.value = true;
    try {
        // 如果 query 为空，则获取所有用户；如果有值，则进行搜索
        const res: any = await getAllUserIdAndNameApi(query || undefined);
        if (res && res.code === 200) {
            userOptions.value = res.data || [];
        }
    } catch (error) {
        console.error('获取用户列表失败', error);
    } finally {
        searchLoading.value = false;
    }
};

// 提交添加人员
const submitAddMember = async () => {
    if (!addFormRef.value) return;
    await addFormRef.value.validate(async (valid) => {
        if (valid) {
            submitLoading.value = true;
            try {
                const data = {
                    clubId: Number(clubId),
                    userId: addForm.userId,
                    roleType: addForm.roleType
                };
                const res: any = await addClubUserApi(data);
                if (res && res.code === 200) {
                    ElMessage.success('添加成功');
                    addDialogVisible.value = false;
                    loadData(); // 刷新列表
                } else {
                    ElMessage.error(res?.message || '添加失败');
                }
            } catch (error) {
                console.error('添加成员失败', error);
                ElMessage.error('添加成员异常');
            } finally {
                submitLoading.value = false;
            }
        }
    });
};

onMounted(() => {
    loadData();
});
</script>

<style lang="less" scoped>
.main-content {
    max-width: 1642px;
    margin: 0 auto;
    padding: 24px;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
    background-color: #f6f6fb;
}

.table-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 24px rgba(0, 88, 187, 0.06);
    background: #fff;
    padding: 20px;

    .table-header {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;

            .title {
                font-size: 18px;
                font-weight: 700;
                color: #2d2f33;
            }
        }
    }
}
</style>