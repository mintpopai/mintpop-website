import { describe, expect, it } from 'vitest'

import { SEO, type SeoRouteKey } from '@/config/seo'

import { routes } from './index'

// 路由表与 SEO 配置各写了一份 path（前者给 vue-router/SSG，后者派生 head 与 sitemap），
// 这里锁死两者一致：SEO 侧多写会让 sitemap 产出 404 项，路由改径未同步会让页面头信息错配。
describe('路由与 SEO 配置契约', () => {
  const namedRoutes = routes.filter((r) => r.name)

  it('每个命名路由都有同名 SEO 条目且 path 一致', () => {
    for (const route of namedRoutes) {
      const entry = SEO[route.name as SeoRouteKey]
      expect(entry, `路由 ${String(route.name)} 缺 SEO 条目`).toBeDefined()
      expect(entry.path, `路由 ${String(route.name)} 的 path 与 SEO 配置不一致`).toBe(route.path)
    }
  })

  it('每个 SEO 条目都对应真实路由（防 sitemap 产出 404 项）', () => {
    const routePaths = new Set(routes.map((r) => r.path))
    for (const [key, entry] of Object.entries(SEO)) {
      expect(routePaths.has(entry.path), `SEO ${key} 的 path ${entry.path} 不在路由表`).toBe(true)
    }
  })
})
