<template>
    <div class="maintenance-hub">
        <!-- Section 1: System Status Bento -->
        <div class="status-grid">
            <el-card class="status-card" shadow="never">
                <div class="card-header">
                    <div class="icon-box cpu">
                        <el-icon>
                            <Cpu />
                        </el-icon>
                    </div>
                    <el-tag type="success" effect="plain" round size="small">正常</el-tag>
                </div>
                <div class="card-body">
                    <div class="label">CPU 使用率</div>
                    <div class="value-row">
                        <span class="value">24.5%</span>
                        <span class="trend down">↓ 2.1%</span>
                    </div>
                    <el-progress :percentage="24.5" :show-text="false" stroke-width="6" color="#0058bb" />
                </div>
            </el-card>

            <el-card class="status-card" shadow="never">
                <div class="card-header">
                    <div class="icon-box memory">
                        <el-icon>
                            <DataAnalysis />
                        </el-icon>
                    </div>
                    <el-tag type="success" effect="plain" round size="small">正常</el-tag>
                </div>
                <div class="card-body">
                    <div class="label">内存占用</div>
                    <div class="value-row">
                        <span class="value">4.2<small>GB</small></span>
                        <span class="total">/ 16GB</span>
                    </div>
                    <el-progress :percentage="26" :show-text="false" stroke-width="6" color="#4c5e66" />
                </div>
            </el-card>

            <el-card class="status-card" shadow="never">
                <div class="card-header">
                    <div class="icon-box disk">
                        <el-icon>
                            <Box />
                        </el-icon>
                    </div>
                    <el-tag type="warning" effect="plain" round size="small">预警</el-tag>
                </div>
                <div class="card-body">
                    <div class="label">磁盘空间</div>
                    <div class="value-row">
                        <span class="value">88%</span>
                        <span class="trend warning">即将存满</span>
                    </div>
                    <el-progress :percentage="88" :show-text="false" stroke-width="6" color="#f59e0b" />
                </div>
            </el-card>

            <el-card class="status-card" shadow="never">
                <div class="card-header">
                    <div class="icon-box db">
                        <el-icon>
                            <Coin />
                        </el-icon>
                    </div>
                    <el-tag type="success" effect="plain" round size="small">正常</el-tag>
                </div>
                <div class="card-body">
                    <div class="label">数据库连接</div>
                    <div class="value-row">
                        <span class="value">124</span>
                        <span class="total">活跃连接</span>
                    </div>
                    <div class="db-avatars">
                        <div class="avatar blue-1">DB1</div>
                        <div class="avatar blue-2">DB2</div>
                        <div class="avatar gray">+3</div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- Section 2: Middle Layout -->
        <div class="middle-layout">
            <!-- Backup Management -->
            <el-card class="backup-card" shadow="never">
                <template #header>
                    <div class="card-header-content">
                        <div class="title-group">
                            <h2 class="section-title">备份记录</h2>
                            <p class="section-subtitle">最近 30 天的系统快照</p>
                        </div>
                        <el-button type="primary" :icon="CirclePlus">手动备份</el-button>
                    </div>
                </template>
                <el-table :data="backupData" style="width: 100%">
                    <el-table-column prop="time" label="备份时间" width="180" />
                    <el-table-column prop="name" label="文件名" />
                    <el-table-column prop="size" label="大小" width="100" />
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger'" size="small"
                                effect="dark">
                                {{ scope.row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="right">
                        <template #default="scope">
                            <el-button link type="primary" v-if="scope.row.status === 'SUCCESS'">下载</el-button>
                            <el-button link type="primary" v-if="scope.row.status === 'SUCCESS'">恢复</el-button>
                            <el-button link type="info" disabled v-if="scope.row.status === 'FAILED'">下载</el-button>
                            <el-button link type="primary" v-if="scope.row.status === 'FAILED'">重试</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- Global Configuration -->
            <el-card class="config-card" shadow="never">
                <template #header>
                    <h2 class="section-title">基础设置</h2>
                </template>
                <div class="config-form">
                    <div class="config-item">
                        <div class="info">
                            <div class="name">系统服务状态</div>
                            <div class="desc">控制整个平台的在线/离线状态</div>
                        </div>
                        <el-switch v-model="config.systemStatus" active-color="#0058bb" />
                    </div>
                    <div class="config-item">
                        <div class="info">
                            <div class="name">维护模式</div>
                            <div class="desc">仅允许管理员账号登录</div>
                        </div>
                        <el-switch v-model="config.maintenanceMode" active-color="#0058bb" />
                    </div>
                    <div class="config-item vertical">
                        <div class="name">全局公告发布</div>
                        <el-input v-model="config.announcement" type="textarea" :rows="4"
                            placeholder="在此输入公告内容，将实时显示在用户首页..." />
                    </div>
                    <el-button class="save-btn">保存更改</el-button>
                </div>
            </el-card>
        </div>

        <!-- Section 3: Audit Logs -->
        <el-card class="audit-card" shadow="never">
            <template #header>
                <h2 class="section-title">操作审计日志</h2>
            </template>
            <el-timeline>
                <el-timeline-item v-for="(log, index) in auditLogs" :key="index" :timestamp="log.time" placement="top">
                    <template #dot>
                        <div class="timeline-icon" :class="log.type">
                            <el-icon v-if="log.icon === 'User'">
                                <User />
                            </el-icon>
                            <el-icon v-else-if="log.icon === 'Setting'">
                                <Setting />
                            </el-icon>
                            <el-icon v-else>
                                <Refresh />
                            </el-icon>
                        </div>
                    </template>
                    <div class="log-content">
                        <div class="log-main">
                            <span class="user">{{ log.user }}</span>
                            <span class="action-text">{{ log.actionText }}</span>
                            <span class="target">{{ log.target }}</span>
                        </div>
                        <div class="log-detail">{{ log.detail }}</div>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
    Cpu,
    DataAnalysis,
    Box,
    Coin,
    CirclePlus,
    User,
    Setting,
    Refresh
} from '@element-plus/icons-vue'

const backupData = [
    { time: '2023-11-24 04:00', name: 'backup_full_20231124.tar.gz', size: '2.4 GB', status: 'SUCCESS' },
    { time: '2023-11-23 04:00', name: 'backup_full_20231123.tar.gz', size: '2.4 GB', status: 'SUCCESS' },
    { time: '2023-11-22 04:00', name: 'backup_full_20231122.tar.gz', size: '2.4 GB', status: 'FAILED' },
]

const config = reactive({
    systemStatus: true,
    maintenanceMode: false,
    announcement: ''
})

const auditLogs = [
    {
        user: '超级管理员',
        actionText: '执行了',
        target: '手动备份',
        time: '10 分钟前',
        detail: '操作 IP: 192.168.1.102 | 备份文件名: backup_manual_1124.zip',
        type: 'primary',
        icon: 'User'
    },
    {
        user: '超级管理员',
        actionText: '更新了',
        target: '全局配置',
        time: '1 小时前',
        detail: '操作：修改“维护模式”状态为 FALSE',
        type: 'warning',
        icon: 'Setting'
    },
    {
        user: '系统核心',
        actionText: '自动执行',
        target: '磁盘清理',
        time: '3 小时前',
        detail: '清理路径: /tmp/cache/* | 释放空间: 450 MB',
        type: 'info',
        icon: 'Refresh'
    }
]
</script>

<style lang="less">
body {
    margin: 0;
    padding: 0;
    background-color: #f6f6fb;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.maintenance-hub {
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;

    .section-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #2d2f33;
    }

    .section-subtitle {
        margin: 4px 0 0;
        font-size: 14px;
        color: #64748b;
    }

    .status-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 32px;

        .status-card {
            border-radius: 12px;
            border: none;
            background-color: #ffffff;

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;

                .icon-box {
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.cpu {
                        background-color: rgba(0, 88, 187, 0.1);
                        color: #0058bb;
                    }

                    &.memory {
                        background-color: rgba(76, 94, 102, 0.1);
                        color: #4c5e66;
                    }

                    &.disk {
                        background-color: rgba(245, 158, 11, 0.1);
                        color: #f59e0b;
                    }

                    &.db {
                        background-color: rgba(59, 130, 246, 0.1);
                        color: #3b82f6;
                    }
                }
            }

            .card-body {
                .label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }

                .value-row {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                    margin-bottom: 16px;

                    .value {
                        font-size: 30px;
                        font-weight: 800;
                        color: #2d2f33;

                        small {
                            font-size: 18px;
                            font-weight: 500;
                            color: #94a3b8;
                            margin-left: 2px;
                        }
                    }

                    .trend {
                        font-size: 12px;
                        font-weight: 500;

                        &.down {
                            color: #10b981;
                        }

                        &.warning {
                            color: #ef4444;
                        }
                    }

                    .total {
                        font-size: 12px;
                        color: #94a3b8;
                    }
                }

                .db-avatars {
                    display: flex;
                    margin-left: 8px;

                    .avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 2px solid #ffffff;
                        margin-left: -8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;

                        &.blue-1 {
                            background-color: #dbeafe;
                            color: #2563eb;
                        }

                        &.blue-2 {
                            background-color: #bfdbfe;
                            color: #1d4ed8;
                        }

                        &.gray {
                            background-color: #f1f5f9;
                            color: #94a3b8;
                        }
                    }
                }
            }
        }
    }

    .middle-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 32px;
        margin-bottom: 32px;

        .backup-card {
            border-radius: 12px;
            border: none;

            .card-header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .el-table {
                --el-table-header-bg-color: #f8fafc;
                --el-table-row-hover-bg-color: #f1f5f9;

                th {
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                td {
                    font-size: 14px;
                    color: #475569;
                }
            }
        }

        .config-card {
            border-radius: 12px;
            border: none;

            .config-form {
                display: flex;
                flex-direction: column;
                gap: 24px;

                .config-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    &.vertical {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .info {
                        .name {
                            font-size: 14px;
                            font-weight: 600;
                            color: #2d2f33;
                        }

                        .desc {
                            font-size: 12px;
                            color: #64748b;
                        }
                    }

                    .name {
                        font-size: 14px;
                        font-weight: 600;
                        color: #2d2f33;
                    }
                }

                .save-btn {
                    width: 100%;
                    height: 44px;
                    background-color: #e2e8f0;
                    border: none;
                    color: #2d2f33;
                    font-weight: 700;
                    font-size: 14px;
                    border-radius: 8px;
                    transition: all 0.2s;

                    &:hover {
                        background-color: #0058bb;
                        color: #ffffff;
                    }
                }
            }
        }
    }

    .audit-card {
        border-radius: 12px;
        border: none;

        .el-timeline {
            padding-left: 8px;

            .timeline-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;

                &.primary {
                    background-color: #eff6ff;
                    color: #3b82f6;
                }

                &.warning {
                    background-color: #fffbeb;
                    color: #f59e0b;
                }

                &.info {
                    background-color: #f8fafc;
                    color: #94a3b8;
                }
            }
        }

        .log-content {
            .log-main {
                font-size: 14px;
                margin-bottom: 4px;

                .user {
                    font-weight: 700;
                    color: #2d2f33;
                }

                .action-text {
                    color: #64748b;
                    margin: 0 8px;
                }

                .target {
                    font-weight: 700;
                    color: #2d2f33;
                }
            }

            .log-detail {
                font-size: 12px;
                color: #64748b;
            }
        }
    }
}

// Element Plus Overrides
.el-card__header {
    border-bottom: 1px solid #f1f5f9;
    padding: 24px;
}

.el-card__body {
    padding: 24px;
}

.el-tag--plain {
    background-color: transparent;
    border-color: currentColor;
}
</style>