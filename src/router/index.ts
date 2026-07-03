import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

// 路由表:交给 vite-ssg 创建 router(history 由 vite-ssg 自动注入)
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HOME',
    component: HomeView,
  },
  // 以下三页设计稿暂未提供,先用占位视图占位,后续补设计再填充
  {
    path: '/legal',
    name: 'LEGAL',
    component: () => import('@/views/LegalView.vue'),
  },
  {
    path: '/login',
    name: 'LOGIN',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'REGISTER',
    component: () => import('@/views/RegisterView.vue'),
  },
  // 404:显式 /404 路由供 SSG 预渲染出 dist/404/index.html(nginx error_page 指向它)
  {
    path: '/404',
    name: 'NOT_FOUND',
    component: () => import('@/views/NotFoundView.vue'),
  },
  // 兜底:客户端侧未匹配路由渲染 404 页(不重定向,保留原 URL 与 nginx 的 404 状态一致)
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

// 支持锚点滚动(#capabilities / #modalities 等),并在普通跳转时回到顶部
export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }
  if (savedPosition) {
    return savedPosition
  }
  return { top: 0 }
}
