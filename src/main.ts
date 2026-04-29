import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './mock/index'
import '@/router/guard'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.less'
import { createPinia } from 'pinia'
// import '@/compoments/navMenu/MenuItem.vue'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 批量全局注册 Element Plus 提供的所有图标组件
app.mount('#app')
