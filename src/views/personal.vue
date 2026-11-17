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
                    <el-button class="action-btn share-btn" :icon="Star" @click="goToMyClubs">我的社团</el-button>
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
                                    <el-button :type="viewMode === 'month' ? 'primary' : ''" size="small"
                                        @click="switchView('month')">月</el-button>
                                    <el-button :type="viewMode === 'week' ? 'primary' : ''" size="small"
                                        @click="switchView('week')">周</el-button>
                                </el-button-group>
                            </div>
                        </div>
                    </template>

                    <!-- 月视图 -->
                    <el-calendar v-if="viewMode === 'month'" v-model="calendarDate">
                        <template #date-cell="{ data }">
                            <div class="calendar-cell">
                                <span class="date-num">{{ data.day.split('-').slice(-1)[0] }}</span>
                                <div v-if="getEvent(data.day)" class="event-badge" :class="getEvent(data.day)?.type">
                                    {{ getEvent(data.day)?.title }}
                                </div>
                            </div>
                        </template>
                    </el-calendar>

                    <!-- 周视图 -->
                    <div v-else class="week-view">
                        <div class="week-toolbar">
                            <span class="week-range">{{ weekRangeText }}</span>
                            <el-button-group>
                                <el-button size="small" :icon="ArrowLeft" @click="shiftWeek(-1)" />
                                <el-button size="small" @click="goCurrentWeek">本周</el-button>
                                <el-button size="small" :icon="ArrowRight" @click="shiftWeek(1)" />
                            </el-button-group>
                        </div>
                        <div class="week-grid">
                            <div v-for="day in weekDays" :key="day.key" class="week-cell"
                                :class="{ today: day.isToday }">
                                <div class="week-cell-header">
                                    <span class="weekday">{{ day.weekday }}</span>
                                    <span class="date-num">{{ day.dayNum }}</span>
                                </div>
                                <div v-if="day.event" class="event-badge" :class="day.event?.type">
                                    {{ day.event?.title }}
                                </div>
                                <div v-else class="week-empty">—</div>
                            </div>
                        </div>
                    </div>

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
                            <el-button @click="handleCancelEdit">返回</el-button>
                            <el-button type="primary" @click="handleSave">保存</el-button>
                        </div>
                    </div>
                </template>
                <el-form :model="editForm" label-width="120px" class="edit-form">
                    <el-form-item label="头像" prop="headUrl">
                        <el-upload
                            class="avatar-uploader"
                            :show-file-list="false"
                            :http-request="handleUploadAvatar"
                            :before-upload="beforeAvatarUpload"
                            :disabled="uploading"
                            accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                        >
                            <img v-if="editForm.headUrl" :src="editForm.headUrl" class="avatar-upload-img" alt="头像" />
                            <div v-else class="avatar-upload-holder">
                                <el-icon><Plus /></el-icon>
                                <span>点击上传</span>
                            </div>
                        </el-upload>
                        <div class="el-upload__tip">支持 jpg / png / gif / webp，大小不超过 20MB</div>
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
import { ref, computed, onBeforeUnmount, } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { getUserInfoApi, updateUserApi, updatePasswordApi } from '@/api/user'
import { useImageUpload } from '@/hooks/useImageUpload'
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
    Key,
    Plus,
    ArrowLeft
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

const router = useRouter()
// 默认定位到今天（周视图显示本周，月视图显示本月）
const calendarDate = ref(new Date())
const isDarkMode = ref(false)

// 跳转我的社团
const goToMyClubs = () => {
    router.push('/memberManage')
}

// 统一日期 key 格式，与 events 的 key 保持一致
const formatDateKey = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
}

// 演示日程：以今天为基准生成，保证打开页面就能看到本周 / 下周的安排
const createDemoEvents = () => {
    const shiftKey = (offset: number) => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() + offset)
        return formatDateKey(date)
    }
    return {
        [shiftKey(0)]: { title: '技术宣讲会', type: 'primary' },
        [shiftKey(2)]: { title: '报名截止', type: 'error' },
        [shiftKey(7)]: { title: '面试 @ 14:00', type: 'tertiary' }
    }
}

const events = createDemoEvents()

const getEvent = (day: string) => {
    return events[day as keyof typeof events]
}

// ===== 校园日程：月 / 周视图切换（默认周视图）=====
const viewMode = ref<'month' | 'week'>('week')

const switchView = (mode: 'month' | 'week') => {
    viewMode.value = mode
}

// 取所在周的周一（周日算上一周的末尾）
const getWeekStart = (date: Date) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const weekday = start.getDay()
    const diff = weekday === 0 ? -6 : 1 - weekday
    start.setDate(start.getDate() + diff)
    return start
}

const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const weekDays = computed(() => {
    const start = getWeekStart(calendarDate.value)
    const todayKey = formatDateKey(new Date())
    return weekLabels.map((label, index) => {
        const date = new Date(start)
        date.setDate(start.getDate() + index)
        const key = formatDateKey(date)
        return {
            key,
            weekday: label,
            dayNum: date.getDate(),
            isToday: key === todayKey,
            event: getEvent(key)
        }
    })
})

const weekRangeText = computed(() => {
    const start = getWeekStart(calendarDate.value)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const startText = `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`
    const endText = start.getFullYear() === end.getFullYear()
        ? `${end.getMonth() + 1}月${end.getDate()}日`
        : `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`
    return `${startText} - ${endText}`
})

// 前后翻周
const shiftWeek = (delta: number) => {
    const date = new Date(calendarDate.value)
    date.setDate(date.getDate() + delta * 7)
    calendarDate.value = date
}

// 回到本周
const goCurrentWeek = () => {
    calendarDate.value = new Date()
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
// 注意：不能把 password 放进提交对象，updateById 会用空串覆盖数据库中的密码哈希
const editForm = ref({
    id: 0,
    headUrl: '',
    code: '',
    name: '',
    college: '',
    major: '',
    phone: '',
    description: ''
})

// 头像上传（20MB 上限），放弃编辑时自动清理未保存的图片
const {
    uploading,
    beforeUpload: beforeAvatarUpload,
    httpRequest: handleUploadAvatar,
    confirmUploaded,
    discardUploaded
} = useImageUpload((url) => {
    editForm.value.headUrl = url
})

// 返回：放弃本次编辑，清理已上传但未保存的图片
const handleCancelEdit = async () => {
    await discardUploaded()
    isEditing.value = false
}

// 页面离开（切路由等）时同样清理
onBeforeUnmount(() => {
    void discardUploaded()
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
            // 图片已被保存，取消待清理状态
            confirmUploaded()
            // 同步本地用户状态，避免返回个人中心后头像还是旧图
            userInfo.value.avatar = editForm.value.headUrl
            sessionStorage.setItem('avatar', editForm.value.headUrl)
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

.week-view {
    padding: 16px 24px 8px;
    overflow-x: auto;

    .week-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        gap: 12px;

        .week-range {
            font-size: 14px;
            font-weight: 700;
            color: #2d2f33;
        }
    }

    .week-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(84px, 1fr));
        gap: 8px;
    }

    .week-cell {
        border: 1px solid #e7e8ee;
        border-radius: 8px;
        padding: 8px;
        min-height: 132px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #fff;
        transition: border-color 0.2s;

        &:hover {
            border-color: rgba(0, 88, 187, 0.4);
        }

        &.today {
            border-color: #0058bb;
            background-color: rgba(0, 88, 187, 0.04);
        }

        .week-cell-header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;

            .weekday {
                font-size: 12px;
                font-weight: 600;
                color: #5a5b60;
            }

            .date-num {
                font-size: 16px;
                font-weight: 700;
                color: #2d2f33;
            }
        }

        .week-empty {
            font-size: 12px;
            color: #c0c4cc;
        }

        .event-badge {
            margin-top: 0;
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

.avatar-uploader {
    :deep(.el-upload) {
        width: 120px;
        height: 120px;
        border: 1px dashed #dcdfe6;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f6f6fb;
        transition: border-color 0.2s;
        cursor: pointer;

        &:hover {
            border-color: #0058bb;
        }
    }

    .avatar-upload-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .avatar-upload-holder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #8c939d;

        .el-icon {
            font-size: 24px;
        }
    }
}
</style>
