<template>
    <div class="main-container">
        <template v-if="!isEditing">
        <!-- Hero Personal Profile Card -->
        <el-card class="profile-card" :body-style="{ padding: '32px' }">
            <div class="profile-content">
                <div class="avatar-wrapper">
                    <el-image class="profile-avatar"
                        :src="getRealImageUrl(userInfo.avatar)"
                        fit="cover" />
                </div>
                <div class="profile-info">
                    <h1 class="name">{{ userInfo.name }}</h1>
                    <p class="student-id">{{ `学号: ${userInfo.code} | ${userInfo.college}` }}</p>
                    <el-tag type="primary" effect="dark" round class="role-tag">
                        {{ userInfo.roleCodes[0] === 'SYSTEMADMIN' ? '系统管理员' : userInfo.roleCodes[0] === 'CLUBADMIN' ?
                            '管理员' :
                            '普通用户' }}

                        <!-- 只考虑一个权限的情况 -->
                    </el-tag>
                </div>
                <div class="profile-actions">
                    <el-button type="primary" :icon="Edit" class="action-btn" @click="handleEdit">编辑资料</el-button>
                    <el-button type="warning" :icon="Key" class="action-btn" @click="isPasswordDialogVisible = true">修改密码</el-button>
                    <el-button class="action-btn share-btn" :icon="Star">分享名片</el-button>
                </div>
            </div>
        </el-card>

        <el-row :gutter="24" class="content-grid">
            <!-- Left Column: Calendar & Management -->
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <el-card class="calendar-card" :body-style="{ padding: '0' }">
                    <template #header>
                        <div class="card-header">
                            <span class="header-title">校园日程</span>
                            <div class="header-actions">
                                <el-button-group>
                                    <el-button type="primary" size="small">月</el-button>
                                    <el-button size="small">周</el-button>
                                </el-button-group>
                            </div>
                        </div>
                    </template>
                    <el-calendar v-model="calendarDate">
                        <template #date-cell="{ data }">
                            <div class="calendar-cell">
                                <span class="date-num">{{ data.day.split('-').slice(-1)[0] }}</span>
                                <div v-if="getEvent(data.day)" class="event-badge" :class="getEvent(data.day).type">
                                    {{ getEvent(data.day).title }}
                                </div>
                            </div>
                        </template>
                    </el-calendar>
                    <div class="calendar-legend">
                        <div class="legend-item"><span class="dot primary"></span> 社团活动</div>
                        <div class="legend-item"><span class="dot error"></span> 招新截止</div>
                        <div class="legend-item"><span class="dot tertiary"></span> 个人面试</div>
                    </div>
                </el-card>

                <el-card class="management-card">
                    <template #header>
                        <div class="card-header">
                            <span class="header-title">
                                <el-icon class="header-icon">
                                    <Management />
                                </el-icon>
                                社团管理入口
                            </span>
                        </div>
                    </template>
                    <el-row :gutter="16">
                        <el-col :span="8" v-for="item in managementLinks" :key="item.title">
                            <div class="management-item group">
                                <div class="icon-box" :class="item.type">
                                    <el-icon>
                                        <component :is="item.icon" />
                                    </el-icon>
                                </div>
                                <h4 class="item-title">{{ item.title }}</h4>
                                <p class="item-desc">{{ item.desc }}</p>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>

            <!-- Right Column: Updates & Settings -->
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-card class="updates-card">
                    <template #header>
                        <div class="card-header">
                            <span class="header-title">最近动态</span>
                            <el-button link type="primary" size="small">全部清除</el-button>
                        </div>
                    </template>
                    <div class="updates-list">
                        <div v-for="(update, index) in updates" :key="index" class="update-item">
                            <div class="update-dot" :class="{ active: index === 0 }"></div>
                            <div class="update-content">
                                <p class="update-text">{{ update.text }}</p>
                                <span class="update-time">{{ update.time }}</span>
                            </div>
                        </div>
                    </div>
                </el-card>

                <el-card class="settings-card">
                    <template #header>
                        <div class="card-header">
                            <span class="header-title">系统设置</span>
                        </div>
                    </template>
                    <div class="settings-list">
                        <div class="settings-item">
                            <div class="item-left">
                                <el-icon>
                                    <Lock />
                                </el-icon>
                                <span>账号安全</span>
                            </div>
                            <el-icon>
                                <ArrowRight />
                            </el-icon>
                        </div>
                        <div class="settings-item">
                            <div class="item-left">
                                <el-icon>
                                    <Bell />
                                </el-icon>
                                <span>通知偏好</span>
                            </div>
                            <el-icon>
                                <ArrowRight />
                            </el-icon>
                        </div>
                        <div class="settings-item no-arrow">
                            <div class="item-left">
                                <el-icon>
                                    <Moon />
                                </el-icon>
                                <span>深色模式</span>
                            </div>
                            <el-switch v-model="isDarkMode" />
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        </template>
        <template v-else>
            <el-card class="edit-card">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">编辑资料</span>
                        <div class="header-actions">
                            <el-button @click="isEditing = false">返回</el-button>
                            <el-button type="primary" @click="handleSave">保存</el-button>
                        </div>
                    </div>
                </template>
                <el-form :model="editForm" label-width="120px" class="edit-form">
                    <el-form-item label="头像地址">
                        <el-input v-model="editForm.headUrl" placeholder="请输入头像链接" style="margin-bottom: 12px;" />
                        <el-image 
                            v-if="editForm.headUrl"
                            :src="editForm.headUrl" 
                            fit="cover" 
                            :preview-src-list="[editForm.headUrl]"
                            style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover;"
                        />
                    </el-form-item>
                    <el-form-item label="学号">
                        <el-input v-model="editForm.code" placeholder="请输入学号" />
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="editForm.name" placeholder="请输入姓名" />
                    </el-form-item>
                    <el-form-item label="学院">
                        <el-input v-model="editForm.college" placeholder="请输入学院" />
                    </el-form-item>
                    <el-form-item label="专业">
                        <el-input v-model="editForm.major" placeholder="请输入专业" />
                    </el-form-item>
                    <el-form-item label="手机">
                        <el-input v-model="editForm.phone" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="个人描述">
                        <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="请输入个人描述" />
                    </el-form-item>
                </el-form>
            </el-card>
        </template>

        <!-- Change Password Dialog -->
        <el-dialog v-model="isPasswordDialogVisible" title="修改密码" width="400px" destroy-on-close>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isPasswordDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleUpdatePassword">确认修改</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { getUserInfoApi, updateUserApi, updatePasswordApi } from '@/api/user'
import {
    Edit,
    Setting,
    UserFilled,
    CircleCheck,
    Calendar,
    Star,
    Lock,
    Bell,
    Moon,
    ArrowRight,
    Management,
    Checked,
    DocumentAdd,
    Key
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

const router = useRouter()
const calendarDate = ref(new Date(2023, 10, 8))
const isDarkMode = ref(false)

const events = {
    '2023-11-03': { title: '技术宣讲会', type: 'primary' },
    '2023-11-08': { title: '报名截止', type: 'error' },
    '2023-11-15': { title: '面试 @ 14:00', type: 'tertiary' }
}

const getEvent = (day: string) => {
    return events[day as keyof typeof events]
}

const managementLinks = [
    { title: '社团管理后台', desc: '管理社团基本信息', icon: Management, type: 'primary' },
    { title: '成员审批', desc: '处理 15 份新申请', icon: Checked, type: 'error' },
    { title: '发布活动', desc: '创建新的招新宣讲', icon: DocumentAdd, type: 'tertiary' }
]

const updates = [
    { text: '您的“校园极客社”申请已通过审批。', time: '2小时前' },
    { text: '系统管理员发布了新的《社团管理规范》。', time: '昨天 14:20' },
    { text: '您关注的“人工智能讲座”即将开始。', time: '2023-10-24' }
]

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
console.log(userInfo.value);

const isEditing = ref(false)
const editForm = ref({
    id: 0,
    headUrl: '',
    code: '',
    password: '',
    name: '',
    college: '',
    major: '',
    phone: '',
    description: ''
})

const handleEdit = async () => {
    try {
        const res = await getUserInfoApi()
        if (res.code === 200 && res.data) {
            const data = res.data
            editForm.value = {
                id: data.id,
                headUrl: data.headUrl || data.avatar || '',
                code: data.code || '',
                password: data.password || '',
                name: data.name || '',
                college: data.college || '',
                major: data.major || '',
                phone: data.phone || '',
                description: data.description || ''
            }
            isEditing.value = true
        } else {
            ElMessage.error(res.message || '获取用户信息失败')
        }
    } catch (error) {
        ElMessage.error('获取用户信息失败')
    }
}

const handleSave = async () => {
    try {
        const res = await updateUserApi(editForm.value)
        if (res.code === 200) {
            ElMessage.success('保存成功')
            isEditing.value = false
        } else {
            ElMessage.error(res.message || '保存失败')
        }
    } catch (error) {
        ElMessage.error('保存失败')
    }
}

// 修改密码相关逻辑
const isPasswordDialogVisible = ref(false)
const passwordFormRef = ref()
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== passwordForm.value.newPassword) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

const passwordRules = {
    oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
}

const handleUpdatePassword = async () => {
    if (!passwordFormRef.value) return
    await passwordFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                const res = await updatePasswordApi({
                    id: userInfo.value.id,
                    type: 2, // 2代表修改密码
                    oldPassword: passwordForm.value.oldPassword,
                    newPassword: passwordForm.value.newPassword
                })
                if (res.code === 200) {
                    ElMessage.success('密码修改成功，请重新登录')
                    isPasswordDialogVisible.value = false
                    passwordForm.value = {
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }
                    // 重新登录逻辑
                    userStore.logout()
                    router.push('/login')
                } else {
                    ElMessage.error(res.message || '密码修改失败')
                }
            } catch (error) {
                ElMessage.error('密码修改请求失败')
            }
        }
    })
}

// 提取真实图片地址
function getRealImageUrl(url: string) {
    if (!url) return ''
    // 从链接里解析出 mediaurl 参数（真实图片）
    const params = new URLSearchParams(url.split('?')[1])
    return params.get('mediaurl') || url
}

</script>

<style lang="less" scoped>
.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 20px;

    min-height: 100vh;
}

.profile-card {
    margin-bottom: 24px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 128px;
        height: 128px;
        background: rgba(0, 88, 187, 0.05);
        border-radius: 50%;
        transform: translate(50%, -50%);
        filter: blur(40px);
    }
}

.profile-content {
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
}

.avatar-wrapper {
    .profile-avatar {
        width: 160px;
        height: 160px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        border: 4px solid #fff;
    }
}

.profile-info {
    flex: 1;

    .name {
        font-size: 32px;
        font-weight: 800;
        color: #2d2f33;
        margin: 0 0 8px 0;
    }

    .student-id {
        font-size: 16px;
        color: #5a5b60;
        margin: 0 0 16px 0;
    }

    .role-tag {
        font-weight: 700;
        padding: 0 12px;
    }
}

.profile-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: row;
        justify-content: center;
    }

    .action-btn {
        height: 44px;
        border-radius: 8px;
        font-weight: 700;
        margin-left: 0 !important;
    }

    .share-btn {
        background-color: #f0f0f6;
        border: none;
        color: #5a5b60;
        margin: 0;

        &:hover {
            background-color: #e7e8ee;
        }
    }
}

.content-grid {
    margin-top: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-title {
        font-size: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-icon {
        color: #0058bb;
    }
}

.calendar-card {
    border-radius: 16px;
    margin-bottom: 24px;
    border: 1px solid #e7e8ee;

    :deep(.el-calendar) {
        --el-calendar-border: none;
        --el-calendar-header-border-bottom: none;
        background: transparent;
    }

    :deep(.el-calendar-table) {
        thead th {
            color: #5a5b60;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 12px 0;
        }

        .el-calendar-day {
            height: 100px;
            padding: 8px;
            transition: background 0.2s;

            &:hover {
                background-color: #f6f6fb;
            }
        }
    }
}

.calendar-cell {
    height: 100%;
    display: flex;
    flex-direction: column;

    .date-num {
        font-size: 12px;
        font-weight: 500;
    }
}

.event-badge {
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    border-left: 2px solid;

    &.primary {
        background: rgba(0, 88, 187, 0.1);
        color: #0058bb;
        border-color: #0058bb;
    }

    &.error {
        background: rgba(179, 27, 37, 0.1);
        color: #b31b25;
        border-color: #b31b25;
    }

    &.tertiary {
        background: rgba(76, 94, 102, 0.1);
        color: #4c5e66;
        border-color: #4c5e66;
    }
}

.calendar-legend {
    padding: 16px 24px;
    background-color: #f0f0f6;
    display: flex;
    gap: 24px;

    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 700;
        color: #5a5b60;

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 2px;

            &.primary {
                background-color: #0058bb;
            }

            &.error {
                background-color: #b31b25;
            }

            &.tertiary {
                background-color: #4c5e66;
            }
        }
    }
}

.management-card {
    border-radius: 16px;
    border-left: 4px solid #0058bb;
}

.management-item {
    padding: 16px;
    background-color: #f6f6fb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
        background-color: rgba(0, 88, 187, 0.05);
        border-color: rgba(0, 88, 187, 0.2);
        transform: translateY(-2px);
    }

    .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        font-size: 20px;

        &.primary {
            background: rgba(0, 88, 187, 0.1);
            color: #0058bb;
        }

        &.error {
            background: rgba(179, 27, 37, 0.1);
            color: #b31b25;
        }

        &.tertiary {
            background: rgba(76, 94, 102, 0.1);
            color: #4c5e66;
        }
    }

    .item-title {
        font-size: 14px;
        font-weight: 700;
        margin: 0 0 4px 0;
    }

    .item-desc {
        font-size: 12px;
        color: #5a5b60;
        margin: 0;
    }
}

.updates-card,
.settings-card {
    border-radius: 16px;
    margin-bottom: 24px;
}

.updates-list {
    .update-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .update-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #dbdde3;
        margin-top: 6px;
        flex-shrink: 0;

        &.active {
            background-color: #0058bb;
        }
    }

    .update-text {
        font-size: 14px;
        font-weight: 500;
        margin: 0;
        color: #2d2f33;
    }

    .update-time {
        font-size: 11px;
        color: #5a5b60;
    }
}

.settings-list {
    .settings-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover:not(.no-arrow) {
            background-color: #f6f6fb;
        }

        .item-left {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 500;
            color: #2d2f33;

            .el-icon {
                font-size: 18px;
                color: #5a5b60;
            }
        }

        .el-icon {
            font-size: 14px;
            color: #5a5b60;
        }
    }
}

.edit-card {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.edit-form {
    padding: 24px 0;
    max-width: 600px;
    margin: 0 auto;
}
</style>
