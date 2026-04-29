import router from "./index";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";

router.beforeEach((to, from, next) => {
    // 固定写法：确保 Pinia 能在路由守卫中正常工作
    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore);
    const isLogin = !!userInfo.value.token;

    // 白名单：不需要登录就能访问的页面
    const whiteList = ["/login", "/register"];

    if (isLogin) {
        // 已登录 → 不让去登录/注册页，直接跳首页
        if (whiteList.includes(to.path)) {
            next("/");
        } else {
            // 已登录，访问其他页面 → 放行
            next();
        }
    } else {
        // 未登录 → 只允许访问白名单
        if (whiteList.includes(to.path)) {
            next();
        } else {
            // 未登录访问其他页面 → 跳登录
            next("/login");
        }
    }
});