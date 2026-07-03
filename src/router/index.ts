import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

import { Locale, localizePath } from '@/config/locale'
import type { SeoRouteKey } from '@/config/seo'
import HomeView from '@/views/HomeView.vue'

// 路由 meta 增强：每条命名路由标注页面语言（catch-all 兜底路由无此字段，读取时回退 EN）
declare module 'vue-router' {
  interface RouteMeta {
    locale?: Locale
  }
}

/** 中文树路由 name 后缀：HOME → HOME_ZH */
export const ZH_NAME_SUFFIX = '_ZH'

// base 路由表：path 恒为英文基准路径（与 SEO 配置同源），双语树由它生成。
// zh=false 的条目不进中文树（404 页只预渲染英文一份，nginx error_page 只指向一个文件）。
interface BaseRouteDef {
  path: string
  name: SeoRouteKey
  // 若 RouteRecordRaw['component'] 索引类型在当前 vue-router 版本下报错，
  // 改用 vue-router 导出的 RawRouteComponent 类型，语义等价
  component: RouteRecordRaw['component']
  zh: boolean
}

const BASE_ROUTES: BaseRouteDef[] = [
  { path: '/', name: 'HOME', component: HomeView, zh: true },
  // 以下三页设计稿暂未提供，先用占位视图占位，后续补设计再填充
  { path: '/legal', name: 'LEGAL', component: () => import('@/views/LegalView.vue'), zh: true },
  { path: '/login', name: 'LOGIN', component: () => import('@/views/LoginView.vue'), zh: true },
  {
    path: '/register',
    name: 'REGISTER',
    component: () => import('@/views/RegisterView.vue'),
    zh: true,
  },
  // 404：显式 /404 路由供 SSG 预渲染出 dist/404/index.html（nginx error_page 指向它）
  {
    path: '/404',
    name: 'NOT_FOUND',
    component: () => import('@/views/NotFoundView.vue'),
    zh: false,
  },
]

// 路由表：交给 vite-ssg 创建 router（history 由 vite-ssg 自动注入）。
// 英文树在根路径，中文树加 /zh 前缀，两套都会被 SSG 预渲染。
export const routes: RouteRecordRaw[] = [
  ...BASE_ROUTES.map((r) => ({
    path: r.path,
    name: r.name,
    component: r.component,
    meta: { locale: Locale.EN },
  } as RouteRecordRaw)),
  ...BASE_ROUTES.filter((r) => r.zh).map((r) => ({
    path: localizePath(r.path, Locale.ZH),
    name: `${r.name}${ZH_NAME_SUFFIX}`,
    component: r.component,
    meta: { locale: Locale.ZH },
  } as RouteRecordRaw)),
  // 兜底：客户端侧未匹配路由渲染 404 页（不重定向，保留原 URL 与 nginx 的 404 状态一致）
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

// 支持锚点滚动（#capabilities / #modalities 等），并在普通跳转时回到顶部
export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }
  if (savedPosition) {
    return savedPosition
  }
  return { top: 0 }
}
