import axios, { type InternalAxiosRequestConfig, type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/store/user'

const service: AxiosInstance = axios.create({
    baseURL: '', // 移除硬编码的本地地址，使用相对路径触发代理
    withCredentials: true, // 带凭证请求
    timeout: 5000
})


// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 1. 对 OPTIONS 请求直接放行，不设置任何 header
    if (config.method?.toUpperCase() === 'OPTIONS') {
        // 清空自定义header，避免触发预检
        delete config.headers.token;
        return config;
    }
    const token = sessionStorage.getItem('token') || ''
    // console.log(token);
    // console.log(config.headers);


    if (token && config.headers) {
        config.headers['token'] = token
    }
    return config

}, (error: AxiosError) => {
    ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error',
    })
    return Promise.reject(error)
})
// axios请求成功后默认会自动用promise封装数据，因此无需手动封装，而请求失败后axios不会自动封装数据，因此需要手动封装数据

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
    // console.log(response);
    if (response.status != 200) {
        ElNotification({
            title: 'Error',
            message: response.data.message,
            type: 'error',
        })
        if (response.status === 401) {
            const userStore = useUserStore()
            userStore.logout()
            router.push('/login')
        }
    } else {
        if (response.data && response.data.code === 401) {
            ElNotification({
                title: 'Error',
                message: '登录已过期，请重新登录',
                type: 'error',
            })
            const userStore = useUserStore()
            userStore.logout()
            router.push('/login')
            return Promise.reject(new Error('Unauthorized'))
        }
        return response.data
    }
}, (error: AxiosError) => {
    if (error.response?.status === 401) {
        ElNotification({
            title: 'Error',
            message: '登录已过期，请重新登录',
            type: 'error',
        })
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
    } else {
        ElNotification({
            title: 'Error',
            message: error.message,
            type: 'error',
        })
    }
    return Promise.reject(error)
})

// 导出
export default service