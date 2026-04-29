import { type RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/Layouts/DefaultLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: '/clubSearch',
        name: 'clubSearch',
        component: () => import('@/views/clubSearch/index.vue'),
      },
      {
        path: '/signUp',
        name: 'signUp',
        component: () => import('@/views/signUp.vue'),
      },
      {
        path: '/result',
        name: 'result',
        component: () => import('@/views/result.vue'),
      },
      {
        path: '/signUpManage',
        name: 'signUpManage',
        component: () => import('@/views/signUpManage.vue'),
      },
      {
        path: '/memberManage',
        name: 'memberManage',
        component: () => import('@/views/memberManage.vue'),
      },
      {
        path: '/clubManage',
        name: 'clubManage',
        component: () => import('@/views/clubManage.vue'),
      },
      {
        path: '/clubMembers',
        name: 'clubMembers',
        component: () => import('@/views/clubMembers.vue'),
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('@/views/userManage.vue'),
      },

      {
        path: '/system',
        name: 'system',
        component: () => import('@/views/system.vue'),
      },
      {
        path: '/personal',
        name: 'personal',
        component: () => import('@/views/personal.vue'),
      }


    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotdFound',
    component: () => import('@/views/NotFound.vue'),
  },

];
export default routes;
