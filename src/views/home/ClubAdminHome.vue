<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getSignPageApi } from '@/api/sign';
import {
    Menu,
    User,
    Calendar,
    UserFilled,
    Setting,
    Search,
    Bell,
    QuestionFilled,
    Promotion,
    Plus,
    Download,
    MoreFilled,
    InfoFilled,
    CircleCheckFilled,
    Message,
    View,
    TopRight,
    CircleCheck,
    Warning,
    ChatDotRound,
    Calendar as CalendarIcon,
    Document
} from '@element-plus/icons-vue';

const router = useRouter();

// Mapping string icons to components for <component :is="...">
const iconMap = {
    Message,
    User,
    Bell,
    View,
    CircleCheck,
    Warning
};

const stats = [
    { title: '待处理申请', value: '42', trend: '比昨日增长 12%', icon: 'Message', color: '#0058bb', bgColor: 'rgba(0, 88, 187, 0.1)' },
    { title: '总成员数', value: '156', trend: '数据已更新', icon: 'User', color: '#4c5e66', bgColor: 'rgba(76, 94, 102, 0.1)' },
    { title: '即将开始的活动', value: '3', trend: '本周内举行', icon: 'Bell', color: '#595c5d', bgColor: 'rgba(89, 92, 93, 0.1)' },
    { title: '最近访客量', value: '850', trend: '活跃度高', icon: 'View', color: '#0058bb', bgColor: 'rgba(0, 88, 187, 0.1)' },
];

const applications = ref<any[]>([]);

const loadApplications = async () => {
    try {
        const res: any = await getSignPageApi(1, 5, { name: '', status: '' });
        if (res && res.code === 200) {
            applications.value = res.data.records || [];
        }
    } catch (error) {
        console.error('Failed to load applications:', error);
    }
};

onMounted(() => {
    loadApplications();
});

const goToSignUpManage = () => {
    router.push('/signUpManage');
};

const notifications = [
    { title: '收到新的社团申请', desc: '张三 提交了对 编程协会 的加入申请，请尽快审核。', time: '2 分钟前', icon: 'Message', color: '#0058bb' },
    { title: '活动场地已确认', desc: '"年度音乐汇演" 场地申请已通过审核，地点：大礼堂。', time: '1 小时前', icon: 'CircleCheck', color: '#4c5e66' },
    { title: '系统维护公告', desc: '系统将于本周六凌晨进行例行维护，届时将暂停服务。', time: '3 小时前', icon: 'Warning', color: '#595c5d' },
];

const clubActivity = [
    { name: '编程协会', value: '98', percentage: 98 },
    { name: '音乐社', value: '85', percentage: 85 },
    { name: '街舞社', value: '76', percentage: 76 },
    { name: '摄影协会', value: '65', percentage: 65 },
    { name: '辩论队', value: '54', percentage: 54 },
];



</script>

<template>
    <div class="content-body">
        <section class="welcome-section">
            <div class="welcome-left">
                <h2>欢迎回来，社团管理员！</h2>
                <p>今天是 2024年10月24日。这是您今天的工作概览。</p>
            </div>
            <div class="welcome-right">
                <el-button :icon="Calendar" round>查看日程</el-button>
                <el-button type="primary" :icon="Plus" round>新建项目</el-button>
            </div>
        </section>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.title" class="stat-card">
                <div class="stat-icon" :style="{ backgroundColor: stat.bgColor, color: stat.color }">
                    <el-icon :size="24">
                        <component :is="stat.icon"></component>
                    </el-icon>
                </div>
                <div class="stat-content">
                    <p class="stat-label">{{ stat.title }}</p>
                    <h3 class="stat-value">{{ stat.value }}</h3>
                    <div class="stat-trend" :style="{ color: stat.color }">
                        <el-icon>
                            <TopRight />
                        </el-icon>
                        {{ stat.trend }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions Redesign -->
        <div class="quick-actions-grid">
            <div class="action-card primary">
                <div class="action-icon">
                    <el-icon>
                        <ChatDotRound />
                    </el-icon>
                </div>
                <div class="action-info">
                    <h4>发布招新通知</h4>
                    <p>向全校学生推送最新的社团招新信息</p>
                </div>
                <el-button type="primary" link>立即发布 <el-icon>
                        <Promotion />
                    </el-icon></el-button>
            </div>
            <div class="action-card">
                <div class="action-icon">
                    <el-icon>
                        <CalendarIcon />
                    </el-icon>
                </div>
                <div class="action-info">
                    <h4>创建新活动</h4>
                    <p>策划并申请新的社团活动场地与时间</p>
                </div>
                <el-button type="primary" link>去创建 <el-icon>
                        <Plus />
                    </el-icon></el-button>
            </div>
            <div class="action-card">
                <div class="action-icon">
                    <el-icon>
                        <Document />
                    </el-icon>
                </div>
                <div class="action-info">
                    <h4>导出成员名单</h4>
                    <p>一键导出所有社团成员的详细联系方式</p>
                </div>
                <el-button type="primary" link>开始导出 <el-icon>
                        <Download />
                    </el-icon></el-button>
            </div>
        </div>

        <div class="dashboard-main">
            <div class="main-left">
                <!-- Recent Applications -->
                <div class="card applications-card">
                    <div class="card-header">
                        <h3>最新申请</h3>
                        <el-link type="primary" :underline="false" @click="goToSignUpManage">查看全部</el-link>
                    </div>
                    <el-table :data="applications" style="width: 100%" class="custom-table">
                        <el-table-column label="学生姓名" width="180">
                            <template #default="scope">
                                <div class="student-cell">
                                    <div class="avatar-circle primary">{{ scope.row.userName?.substring(0, 2)?.toUpperCase() || '未知' }}
                                    </div>
                                    <span class="student-name">{{ scope.row.userName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="申请时间" />
                        <el-table-column prop="clubName" label="申请社团" />
                        <el-table-column label="状态" align="right">
                            <template #default="scope">
                                <el-tag v-if="scope.row.status === '0'" type="warning" round effect="light" size="small">待审核</el-tag>
                                <el-tag v-if="scope.row.status === '1'" type="success" round effect="light" size="small">通过</el-tag>
                                <el-tag v-if="scope.row.status === '2'" type="danger" round effect="light" size="small">拒绝</el-tag>
                                <el-tag v-if="scope.row.status === '3'" type="info" round effect="light" size="small">取消</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- Club Activity Ranking -->
                <div class="card activity-card">
                    <div class="card-header">
                        <h3>社团活跃度排行</h3>
                    </div>
                    <div class="activity-list">
                        <div v-for="(item, index) in clubActivity" :key="index" class="activity-item">
                            <div class="club-info">
                                <span class="club-name">{{ item.name }}</span>
                                <span class="activity-val">{{ item.value }}</span>
                            </div>
                            <el-progress :percentage="item.percentage" :show-text="false" color="#0058bb" />
                        </div>
                    </div>
                </div>

            </div>

            <div class="main-right">
                <!-- Notifications -->
                <div class="card notifications-card">
                    <div class="card-header">
                        <h3>最新通知</h3>
                        <el-button :icon="MoreFilled" circle variant="text" size="small" />
                    </div>
                    <div class="notification-list">
                        <div v-for="(note, index) in notifications" :key="index" class="notification-item">
                            <div class="timeline-line" v-if="index !== notifications.length - 1"></div>
                            <div class="note-icon" :style="{ backgroundColor: note.color }">
                                <el-icon :size="14">
                                    <component :is="iconMap[note.icon]"></component>
                                </el-icon>
                            </div>
                            <div class="note-content">
                                <p class="note-title">{{ note.title }}</p>
                                <p class="note-desc">{{ note.desc }}</p>
                                <p class="note-time">{{ note.time }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tips -->
                <div class="card tips-card">
                    <div class="tips-header">
                        <el-icon color="#0058bb">
                            <Promotion />
                        </el-icon>
                        <span>管理员小贴士</span>
                    </div>
                    <p>您可以通过“导出”功能，一次性下载所有待处理申请的摘要信息。建议每周定期备份数据以防丢失。</p>
                </div>

                <!-- System Status -->
                <div class="card quick-stats-card">
                    <h3>系统状态</h3>
                    <div class="status-item">
                        <span>CPU 使用率</span>
                        <el-progress :percentage="24" :show-text="false" color="#0058bb" />
                    </div>
                    <div class="status-item">
                        <span>内存使用率</span>
                        <el-progress :percentage="45" :show-text="false" color="#0058bb" />
                    </div>
                    <div class="status-item">
                        <span>磁盘空间</span>
                        <el-progress :percentage="68" :show-text="false" color="#0058bb" />
                    </div>
                    <div class="status-item">
                        <span>系统运行时间</span>
                        <span style="color: #0f172a; font-weight: 700; font-size: 16px;">128 天</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.content-body {
    max-width: 1640px;
    width: 100%;
    box-sizing: border-box;
}

.welcome-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .welcome-left {
        h2 {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
        }

        p {
            color: #64748b;
            font-weight: 500;
            font-size: 16px;
        }
    }

    .welcome-right {
        display: flex;
        gap: 12px;
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    .stat-card {
        background-color: white;
        padding: 24px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .stat-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .stat-content {
            .stat-label {
                font-size: 14px;
                font-weight: 600;
                color: #64748b;
                margin: 0 0 4px 0;
            }

            .stat-value {
                font-size: 28px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 4px 0;
            }

            .stat-trend {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                font-weight: 700;
            }
        }
    }
}

.quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    .action-card {
        background-color: white;
        padding: 24px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.3s;

        &:hover {
            border-color: #0058bb;
            background-color: rgba(0, 88, 187, 0.02);
        }

        &.primary {
            background-color: #0058bb;
            color: white;
            border: none;

            .action-icon {
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .action-info {
                h4 {
                    color: white;
                }

                p {
                    color: rgba(255, 255, 255, 0.8);
                }
            }

            .el-button {
                color: white;

                &:hover {
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }

        .action-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background-color: rgba(0, 88, 187, 0.1);
            color: #0058bb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .action-info {
            h4 {
                font-size: 18px;
                font-weight: 700;
                margin: 0 0 4px 0;
                color: #0f172a;
            }

            p {
                font-size: 13px;
                color: #64748b;
                margin: 0;
                line-height: 1.5;
            }
        }

        .el-button {
            align-self: flex-start;
            padding: 0;
            font-weight: 700;
            font-size: 14px;

            .el-icon {
                margin-left: 4px;
            }
        }
    }
}

.dashboard-main {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
}

.main-left {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.main-right {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.card {
    background-color: white;
    padding: 28px;
    border-radius: 24px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    h3 {
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
    }
}

.applications-card {
    .custom-table {
        :deep(.el-table__header) {
            th {
                background-color: #f8fafc;
                color: #64748b;
                font-size: 13px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 12px 0;
            }
        }

        .student-cell {
            display: flex;
            align-items: center;
            gap: 12px;

            .avatar-circle {
                width: 36px;
                height: 36px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 700;

                &.primary {
                    background-color: rgba(0, 88, 187, 0.1);
                    color: #0058bb;
                }

                &.warning {
                    background-color: rgba(234, 179, 8, 0.1);
                    color: #ca8a04;
                }
            }

            .student-name {
                font-weight: 700;
                font-size: 15px;
                color: #1e293b;
            }
        }
    }
}

.activity-card {
    .activity-list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .activity-item {
            .club-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;

                .club-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #334155;
                }

                .activity-val {
                    font-size: 13px;
                    font-weight: 800;
                    color: #0058bb;
                }
            }
        }
    }
}

.notifications-card {
    background-color: #f8fafc;
    border: 1px solid rgba(0, 0, 0, 0.03);

    .notification-list {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .notification-item {
            display: flex;
            gap: 16px;
            position: relative;

            .timeline-line {
                position: absolute;
                left: 16px;
                top: 32px;
                bottom: -24px;
                width: 2px;
                background-color: rgba(0, 0, 0, 0.05);
            }

            .note-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
                z-index: 1;
            }

            .note-content {
                .note-title {
                    font-size: 14px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    color: #1e293b;
                }

                .note-desc {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 8px 0;
                }

                .note-time {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                }
            }
        }
    }
}

.tips-card {
    background-color: rgba(0, 88, 187, 0.04);
    border: 1px solid rgba(0, 88, 187, 0.08);

    .tips-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 15px;
        font-weight: 700;
        color: #0058bb;
    }

    p {
        font-size: 13px;
        color: #1e40af;
        line-height: 1.7;
        margin: 0;
    }
}

.quick-stats-card {
    h3 {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 20px 0;
    }

    .status-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;

        &:last-child {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0;
        }

        span {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
        }
    }
}

@media (max-width: 1280px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .quick-actions-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-main {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
}
</style>
