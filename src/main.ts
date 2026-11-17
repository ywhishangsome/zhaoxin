import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 国际化：全局切换为简体中文（分页、空状态、日期等组件文案）
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// Element Plus 的日期类组件基于 dayjs，同步切换 dayjs 语言包
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import router from './router'
import App from './App.vue'
import './mock/index'
import '@/router/guard'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.less'
import { createPinia } from 'pinia'
// import '@/compoments/navMenu/MenuItem.vue'
dayjs.locale('zh-cn')
const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(createPinia())
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 批量全局注册 Element Plus 提供的所有图标组件
app.mount('#app')
