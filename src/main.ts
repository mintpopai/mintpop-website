import { ViteSSG } from 'vite-ssg'

// 字体自托管（Fontsource，只引入实际用到的字重）：
// 站点面向含中国大陆在内的全球用户，Google Fonts 在大陆被阻断且外链样式表会
// render-blocking 整页白屏，故不走外链（见全局规范 global-reachability.md）。
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/newsreader/500.css'
import '@fontsource/newsreader/500-italic.css'

import './styles/theme.css'
import './styles/base.css'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'

import App from './App.vue'
import { routes, scrollBehavior } from './router'

// vite-ssg 约定:导出 createApp 工厂;构建期对每个路由调用、浏览器端用于 hydration
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL, scrollBehavior },
  // setup 回调:安装 i18n,并用路由守卫让语言唯一由 URL(meta.locale)决定;
  // SSG 构建期逐路由渲染同样走守卫,产物语言与运行时一致
  ({ app, router }) => {
    const i18n = createAppI18n()
    app.use(i18n)
    router.beforeEach((to) => {
      i18n.global.locale.value = to.meta.locale ?? Locale.EN
    })
  },
)
