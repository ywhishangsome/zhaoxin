export const menuList = [
    {
        title: "首页",
        path: "/home",
        icon: "HomeFilled",
        roles: ['STUDENT', 'SYSTEMADMIN', 'CLUBADMIN']
    },
    {
        title: "社团浏览",
        path: "/clubSearch",
        icon: "View",
        roles: ['STUDENT', 'SYSTEMADMIN', 'CLUBADMIN']
    },
    {
        title: "我的报名",
        path: "/signUp",
        icon: "Edit",
        roles: ['STUDENT', 'CLUBADMIN']

    },

    {
        title: "报名审核",
        path: "/signUpManage",
        icon: "Document",
        roles: ["CLUBADMIN"]
    },
    {
        title: "我的社团",
        path: "/memberManage",
        icon: "Star",
        roles: ["STUDENT", "CLUBADMIN"],
    },
    {
        title: "社团管理",
        path: "/clubManage",
        icon: "Document",
        roles: ["SYSTEMADMIN"],
    },
    {
        title: "用户管理",
        path: "/userManage",
        icon: "Stamp",
        roles: ["SYSTEMADMIN"],

    },

    {
        title: "系统维护",
        path: "/system",
        icon: "Setting",
        roles: ["SYSTEMADMIN"],
    },
    {
        title: "个人信息",
        path: "/personal",
        icon: "User",
        roles: ['STUDENT', 'SYSTEMADMIN', 'CLUBADMIN']
    },
];