<script setup lang="ts">
import {
    Calendar,
    View,
    UserFilled,
    Pointer,
    CirclePlus,
    Box,
    Key,
    Promotion
} from '@element-plus/icons-vue';


const stats = [
    { title: '总访问量', value: '9120', change: '+12%', icon: View, color: '#0058bb', bgColor: 'rgba(0, 88, 187, 0.1)' },
    { title: '在线用户', value: '182', change: '实时', icon: UserFilled, color: '#4c5e66', bgColor: 'rgba(76, 94, 102, 0.1)', live: true },
    { title: '点击率', value: '9520', change: '+5.4%', icon: Pointer, color: '#5191ff', bgColor: 'rgba(81, 145, 255, 0.1)' },
    { title: '新增用户', value: '156', change: '今日', icon: CirclePlus, color: '#b31b25', bgColor: 'rgba(179, 27, 37, 0.1)' }
];

const clubStats = [
    { name: '艺术与传媒学院', value: 126, percentage: 90 },
    { name: '计算机科学学院', value: 98, percentage: 70 },
    { name: '经济与管理学院', value: 85, percentage: 60 },
    { name: '外国语学院', value: 62, percentage: 45 }
];

const logs = [
    { admin: 'Zhang Chen', initials: 'ZC', type: '权限变更', detail: '更新了"篮球协会"负责人的管理权限', time: '10分钟前', typeColor: '#0058bb', typeBg: '#f0f2ff' },
    { admin: 'Li Wei', initials: 'LW', type: '审批通过', detail: '批准了"极客编程社"的成立申请', time: '45分钟前', typeColor: '#67c23a', typeBg: '#f0f9eb' },
    { admin: 'System Bot', initials: 'SYS', type: '自动备份', detail: '全库镜像备份完成 (Size: 1.2GB)', time: '2小时前', typeColor: '#909399', typeBg: '#f4f4f5' },
    { admin: 'Admin_02', initials: 'AD', type: '敏感操作', detail: '删除了过期的用户招募日志', time: '5小时前', typeColor: '#f56c6c', typeBg: '#fef0f0' }
];
</script>

<template>
    <div class="dashboard-content">
        <div class="welcome-header">
            <div class="welcome-text">
                <h2>系统总览</h2>
                <p>欢迎回来，系统超级管理员。这是今日的校园活动数据中心。</p>
            </div>
            <el-button class="date-picker-btn">
                <el-icon>
                    <Calendar />
                </el-icon>
                最近 30 天
            </el-button>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.title" class="stat-card" :style="{ borderLeftColor: stat.color }">
                <div class="stat-header">
                    <div class="stat-icon" :style="{ backgroundColor: stat.bgColor, color: stat.color }">
                        <el-icon>
                            <component :is="stat.icon" />
                        </el-icon>
                    </div>
                    <div v-if="stat.live" class="live-tag">
                        <span class="pulse-dot"></span>
                        实时
                    </div>
                    <div v-else class="change-tag" :class="{ positive: stat.change.startsWith('+') }">
                        {{ stat.change }}
                    </div>
                </div>
                <div class="stat-info">
                    <span class="stat-title">{{ stat.title }}</span>
                    <h3 class="stat-value">{{ stat.value }}</h3>
                </div>
            </div>
        </div>

        <!-- Middle Section -->
        <div class="middle-section">
            <!-- Club Stats Chart -->
            <div class="chart-card">
                <div class="card-header">
                    <h3>社团入驻统计</h3>
                    <div class="legend">
                        <span class="legend-item"><i class="dot active"></i> 活跃</span>
                        <span class="legend-item"><i class="dot waiting"></i> 等待中</span>
                    </div>
                </div>
                <div class="chart-content">
                    <div v-for="club in clubStats" :key="club.name" class="chart-row">
                        <div class="row-info">
                            <span>{{ club.name }}</span>
                            <span class="value">{{ club.value }}</span>
                        </div>
                        <el-progress :percentage="club.percentage" :show-text="false" stroke-width="16"
                            color="#0058bb" />
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Approval Status -->
                <div class="status-card">
                    <h3>社团审批状态</h3>
                    <div class="status-stats">
                        <div class="status-item">
                            <span class="num primary">12</span>
                            <span class="label">待处理</span>
                        </div>
                        <div class="divider"></div>
                        <div class="status-item">
                            <span class="num success">148</span>
                            <span class="label">已通过</span>
                        </div>
                        <div class="divider"></div>
                        <div class="status-item">
                            <span class="num danger">3</span>
                            <span class="label">已拒绝</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Tiles -->
                <div class="quick-tiles">
                    <div class="tile">
                        <el-icon>
                            <Box />
                        </el-icon>
                        <span>数据库备份</span>
                    </div>
                    <div class="tile">
                        <el-icon>
                            <Key />
                        </el-icon>
                        <span>用户权限</span>
                    </div>
                    <div class="tile full">
                        <el-icon>
                            <Promotion />
                        </el-icon>
                        <span>全局公告发布</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Logs Table -->
        <div class="logs-section">
            <div class="logs-header">
                <h3>最近系统日志</h3>
                <a href="#">查看全部日志</a>
            </div>
            <el-table :data="logs" style="width: 100%" class="custom-table">
                <el-table-column label="管理员" width="200">
                    <template #default="scope">
                        <div class="admin-cell">
                            <div class="initials">{{ scope.row.initials }}</div>
                            <span class="name">{{ scope.row.admin }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作类型" width="150">
                    <template #default="scope">
                        <span class="type-tag"
                            :style="{ backgroundColor: scope.row.typeBg, color: scope.row.typeColor }">
                            {{ scope.row.type }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="detail" label="详细信息" />
                <el-table-column prop="time" label="时间戳" align="right" width="150" />
            </el-table>
        </div>
    </div>


</template>

<style lang="less" scoped>
.dashboard-content {
    .welcome-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 32px;

        .welcome-text {
            h2 {
                font-size: 32px;
                font-weight: 800;
                margin: 0;
                letter-spacing: -1px;
            }

            p {
                margin: 8px 0 0;
                color: #64748b;
                font-weight: 500;
            }
        }

        .date-picker-btn {
            background-color: #fff;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            font-weight: 700;
            height: 40px;
            padding: 0 16px;

            .el-icon {
                margin-right: 8px;
            }
        }
    }

    // Stats Grid
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 32px;

        .stat-card {
            background-color: #fff;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-left: 4px solid #0058bb;
            transition: all 0.3s;

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            }

            .stat-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;

                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .change-tag {
                    font-size: 12px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 6px;
                    background-color: #f1f5f9;
                    color: #64748b;

                    &.positive {
                        background-color: #f0f9eb;
                        color: #67c23a;
                    }
                }

                .live-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748b;

                    .pulse-dot {
                        width: 8px;
                        height: 8px;
                        background-color: #67c23a;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    }
                }
            }

            .stat-info {
                .stat-title {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 600;
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: 800;
                    margin: 4px 0 0;
                }
            }
        }
    }

    // Middle Section
    .middle-section {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 32px;
        margin-bottom: 32px;

        .chart-card {
            background-color: #fff;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 40px;

                h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 800;
                }

                .legend {
                    display: flex;
                    gap: 16px;

                    .legend-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 12px;
                        font-weight: 700;
                        color: #64748b;

                        .dot {
                            width: 12px;
                            height: 12px;
                            border-radius: 3px;

                            &.active {
                                background-color: #0058bb;
                            }

                            &.waiting {
                                background-color: #e2e8f0;
                            }
                        }
                    }
                }
            }

            .chart-content {
                display: flex;
                flex-direction: column;
                gap: 32px;

                .chart-row {
                    .row-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 700;

                        .value {
                            color: #0058bb;
                        }
                    }

                    :deep(.el-progress-bar__outer) {
                        background-color: #f1f5f9;
                        border-radius: 8px;
                    }

                    :deep(.el-progress-bar__inner) {
                        border-radius: 8px;
                        background: linear-gradient(90deg, #0058bb, #5191ff);
                    }
                }
            }
        }

        .right-column {
            display: flex;
            flex-direction: column;
            gap: 24px;

            .status-card {
                background-color: #f1f5f9;
                padding: 24px;
                border-radius: 12px;
                border: 1px solid #fff;

                h3 {
                    margin: 0 0 24px;
                    font-size: 18px;
                    font-weight: 800;
                }

                .status-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 16px;

                    .status-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        .num {
                            font-size: 24px;
                            font-weight: 800;
                            margin-bottom: 4px;

                            &.primary {
                                color: #0058bb;
                            }

                            &.success {
                                color: #67c23a;
                            }

                            &.danger {
                                color: #f56c6c;
                            }
                        }

                        .label {
                            font-size: 10px;
                            font-weight: 800;
                            color: #64748b;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                    }

                    .divider {
                        width: 1px;
                        height: 40px;
                        background-color: rgba(0, 0, 0, 0.1);
                    }
                }
            }

            .quick-tiles {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;

                .tile {
                    background-color: #fff;
                    padding: 24px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;

                    .el-icon {
                        font-size: 32px;
                        color: #0058bb;
                    }

                    span {
                        font-size: 14px;
                        font-weight: 700;
                    }

                    &:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        border-color: rgba(0, 88, 187, 0.2);

                        .el-icon {
                            transform: scale(1.1);
                        }
                    }

                    &.full {
                        grid-column: span 2;
                        flex-direction: row;
                        justify-content: center;
                        gap: 16px;
                    }
                }
            }
        }
    }

    // Logs Section
    .logs-section {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;

        .logs-header {
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f1f5f9;

            h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 800;
            }

            a {
                color: #0058bb;
                font-size: 14px;
                font-weight: 700;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .custom-table {
            :deep(.el-table__header-wrapper) {
                th {
                    background-color: #f8fafc;
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 16px 0;
                }
            }

            .admin-cell {
                display: flex;
                align-items: center;
                gap: 12px;

                .initials {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: rgba(0, 88, 187, 0.1);
                    color: #0058bb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                }

                .name {
                    font-weight: 700;
                    font-size: 14px;
                }
            }

            .type-tag {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
            }

            :deep(.el-table__row) {
                td {
                    padding: 16px 0;
                    font-weight: 500;
                }

                &:hover>td {
                    background-color: #f8fafc !important;
                }
            }
        }
    }
}


// FAB
.fab {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 56px;
    height: 56px;
    background-color: #0058bb;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 88, 187, 0.3);
    cursor: pointer;
    transition: all 0.2s;
    z-index: 100;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(0, 88, 187, 0.4);
    }
}


@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.5);
        opacity: 0.5;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
