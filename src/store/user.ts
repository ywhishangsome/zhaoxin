import { loginApi } from "@/api/login";

import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { reactive } from "vue";
interface UserInfo {
    id: number
    code: string
    name: string
    college: string
    major: string
    phone: string
    roleCodes: string[]
    avatar: string
    token: string
}

export const useUserStore = defineStore('user', () => {
    const userInfo = reactive<UserInfo>({} as UserInfo);
    userInfo.token = sessionStorage.getItem('token') || '';
    userInfo.name = sessionStorage.getItem('name') || '';
    userInfo.roleCodes = JSON.parse(sessionStorage.getItem('roleCodes')!);
    userInfo.avatar = sessionStorage.getItem('avatar') || '';
    userInfo.college = sessionStorage.getItem('college') || '';
    userInfo.major = sessionStorage.getItem('major') || '';
    userInfo.phone = sessionStorage.getItem('phone') || '';
    userInfo.id = Number(sessionStorage.getItem('id') || '0');
    userInfo.code = sessionStorage.getItem('code') || '';

    const login = async (logindata: any) => {
        try {

            const { data, message } = await loginApi(logindata);
            if (!data) {
                if (message === '验证码错误') {
                    ElMessage.error('验证码错误');
                    throw Error
                }
                else {
                    ElMessage.error('用户名或密码错误');
                    throw Error
                }

            }
            const { id, college, major, name, phone, roleCodes, token, avatar, code } = data;
            userInfo.college = college;
            userInfo.major = major;
            userInfo.name = name;
            userInfo.phone = phone;
            userInfo.roleCodes = roleCodes;
            userInfo.token = token;
            userInfo.id = id;
            userInfo.avatar = avatar;
            userInfo.code = code;
            sessionStorage.setItem('token', userInfo.token);
            sessionStorage.setItem('name', userInfo.name);
            sessionStorage.setItem('avatar', userInfo.avatar);
            sessionStorage.setItem('college', userInfo.college);
            sessionStorage.setItem('major', userInfo.major);
            sessionStorage.setItem('phone', userInfo.phone);
            sessionStorage.setItem('id', userInfo.id.toString());
            sessionStorage.setItem('code', userInfo.code);
            sessionStorage.setItem('roleCodes', JSON.stringify(userInfo.roleCodes));
            // console.log(userInfo);

            ElMessage.success('登录成功,即将跳转...');


        } catch (err) {
            console.log("用户名或密码错误", err);
            // ElMessage.error('用户名或密码错误');

        }

    }
    const logout = () => {
        userInfo.id = 0;
        userInfo.code = '';
        userInfo.name = '';
        userInfo.college = '';
        userInfo.major = '';
        userInfo.phone = '';
        userInfo.roleCodes = [];
        userInfo.avatar = '';
        userInfo.token = '';
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('roleCodes');
    }
    return {
        userInfo,
        login,
        logout
    }
})