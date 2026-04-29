<template>
    <div class="login-container">
        <!-- Header -->
        <header class="header">
            <div class="logo">社团招新管理系统</div>
            <div class="nav-links">
                <span class="nav-item">帮助中心</span>
            </div>
        </header>

        <main class="main-content">
            <!-- Background Shapes -->
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>

            <div class="login-wrapper">
                <div class="login-left">
                    <div class="welcome-section">
                        <h1 class="title">欢迎<span>回来</span></h1>
                        <p class="subtitle">开启你的精彩校园社团生活</p>
                    </div>

                    <div class="login-card">
                        <el-form :model="loginForm" ref="formRef" :rules="rules">
                            <el-form-item label="账号" prop="code">
                                <el-input v-model="loginForm.code" placeholder="请输入学号或账号" :prefix-icon="User" />
                            </el-form-item>

                            <el-form-item label="密码" prop="password">
                                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"
                                    :prefix-icon="Lock" show-password />
                            </el-form-item>
                            <el-form-item label="验证码" prop="picCode" class="captcha-item" @keyup.enter="handleLogin">
                                <el-input v-model="loginForm.picCode" placeholder="请输入验证码"
                                    class="captcha-input"></el-input>
                                <img :src="codeImg" alt="" class="captcha-img" @click="refreshImg">
                            </el-form-item>

                            <el-button type="primary" class="login-btn" @click="handleLogin">
                                登录
                            </el-button>
                        </el-form>

                        <div class="register-link">
                            <router-link to="/register" class="register-link">新用户？立即注册</router-link>
                        </div>
                    </div>

                    <div class="quote">
                        "The future belongs to those who believe in the beauty of their dreams."
                    </div>
                </div>
            </div>

            <!-- Right Decorative Section -->
            <div class="decorative-sidebar">
                <div class="circle-accent"></div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="copyright">© 2024 ClubConnect Campus. 保留所有权利。</div>
            <div class="footer-links">
                <el-link :underline="false">隐私政策</el-link>
                <el-link :underline="false">服务条款</el-link>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'
import { getPicCodeApi } from '@/api/login'
const loginForm = reactive({
    code: '',
    password: '',
    picCode: '',
    key: ''

})

const router = useRouter()
const rules = reactive<FormRules>({
    code: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    picCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})
const formRef = ref<FormInstance>()
const userStore = useUserStore()
const handleLogin = async () => {
    try {

        await formRef.value?.validate()

        await userStore.login(loginForm)
        setTimeout(() => {
            // 跳转到首页
            router.push('/')
        }, 2000)

    } catch (err: any) {
        console.log('校验失败', err)
        //验证码错误
        ElMessage.error(err.picCode[0].message)

    }
}

const codeImg = ref<string>('')

const getPic = async () => {
    try {
        const res = await getPicCodeApi()
        codeImg.value = res.data.pic
        loginForm.key = res.data.key
        // console.log(codeImg.value);
    } catch (err) {
        ElMessage.error('服务器出错')


    }
}
const refreshImg = () => {
    getPic()


}
onMounted(() => {
    getPic()

})
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Be Vietnam Pro', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background-color: #f6f6fb;
    color: #2d2f33;
}

.login-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;

    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
        background: rgba(246, 246, 251, 0.8);
        backdrop-filter: blur(10px);

        .logo {
            font-size: 24px;
            font-weight: 800;
            color: #0058bb;
            letter-spacing: -0.5px;
        }

        .nav-item {
            font-size: 14px;
            color: #5a5b60;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: #0058bb;
            }
        }
    }

    .main-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        position: relative;

        .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 0;
        }

        .shape-1 {
            top: -100px;
            left: -100px;
            width: 400px;
            height: 400px;
            background: rgba(0, 88, 187, 0.05);
        }

        .shape-2 {
            bottom: -100px;
            right: 20%;
            width: 400px;
            height: 400px;
            background: rgba(76, 94, 102, 0.1);
        }

        .login-wrapper {
            width: 100%;
            max-width: 440px;
            z-index: 10;
            margin-right: 15%; // Offset for sidebar
            margin-left: 70px;

            @media (max-width: 1024px) {

                margin-right: 0;
            }
        }

        .welcome-section {
            margin-bottom: 40px;
            text-align: left;

            .title {
                font-size: 42px;
                font-weight: 800;
                color: #2d2f33;
                margin-bottom: 8px;

                span {
                    color: #0058bb;
                }
            }

            .subtitle {
                font-size: 18px;
                color: #5a5b60;
            }
        }

        .login-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 40px;
            padding-top: 80px;
            box-shadow: 0 20px 40px rgba(0, 88, 187, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.5);

            .captcha-item {
                display: flex !important;
                align-items: center !important;


                .captcha-img {
                    width: 150px;
                    height: 48px;
                    cursor: pointer;
                    background-color: #f0f0f6;
                    flex-shrink: 0;
                    object-fit: cover;
                    display: block;
                }


                .captcha-input {
                    flex: 1;

                    .el-input__inner {
                        height: 48px;
                    }
                }
            }

            .el-form-item {
                margin-bottom: 20px;
                display: flex;
                align-items: center;

                .el-form-item__label {
                    font-weight: 600;
                    color: #5a5b60;
                    line-height: 54px;
                    height: 54px;

                }
            }

            .el-input {
                --el-input-border-radius: 12px;
                --el-input-bg-color: #f0f0f6;
                --el-input-border-color: transparent;
                --el-input-hover-border-color: #0058bb;
                --el-input-focus-border-color: #0058bb;


                .el-input__wrapper {
                    padding: 3px 16px;
                    box-shadow: none !important;
                    background-color: #f0f0f6;
                    transition: all 0.3s;



                    &.is-focus {
                        background-color: #fff;
                        box-shadow: 0 0 0 1px #0058bb inset !important;
                    }
                }

                .el-input__inner {
                    height: 48px;
                    font-size: 15px;
                }

                .el-input__prefix-icon {
                    font-size: 20px;
                    color: #acadb1;
                }
            }

            .login-btn {
                width: 100%;
                height: 56px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 700;
                background-color: #0058bb;
                border: none;
                margin-top: 16px;
                box-shadow: 0 10px 20px rgba(0, 88, 187, 0.2);
                transition: all 0.3s;

                &:hover {
                    background-color: #004ca4;
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(0, 88, 187, 0.25);
                }

                &:active {
                    transform: scale(0.98);
                }
            }

            .register-link {
                margin-top: 32px;
                text-align: center;

                .el-link {
                    font-size: 14px;
                    color: #5a5b60;
                    text-decoration: underline;
                    text-underline-offset: 4px;

                    &:hover {
                        color: #0058bb;
                    }
                }
            }
        }

        .quote {
            margin-top: 48px;
            font-size: 12px;
            font-style: italic;
            color: #5a5b60;
            opacity: 0.5;
            letter-spacing: 0.5px;
        }

        .decorative-sidebar {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 25%;
            background: rgba(108, 159, 255, 0.1);
            clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
            display: flex;
            align-items: center;
            justify-content: center;

            @media (max-width: 1024px) {
                display: none;
            }

            .circle-accent {
                width: 120px;
                height: 120px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                filter: blur(4px);
            }
        }
    }

    .footer {
        padding: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1440px;
        margin: 0 auto;
        opacity: 0.7;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 16px;
            text-align: center;
        }

        .copyright {
            font-size: 13px;
            color: #acadb1;
        }

        .footer-links {
            display: flex;
            gap: 24px;

            .el-link {
                font-size: 13px;
                color: #acadb1;
                text-decoration: underline;
                text-underline-offset: 4px;

                &:hover {
                    color: #0058bb;
                }
            }
        }
    }
}
</style>
