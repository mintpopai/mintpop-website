import { describe, expect, it } from 'vitest'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { Locale, localizePath } from '@/config/locale'
import { SEO, type SeoRouteKey } from '@/config/seo'
import { INDEXABLE_ROUTES } from '@/config/site'

import { ANCHOR_SCROLL_OFFSET, routes, scrollBehavior, ZH_NAME_SUFFIX } from './index'

// 路由表与 SEO 配置各写了一份 path（前者给 vue-router/SSG，后者派生 head 与 sitemap），
// 这里锁死两者一致，并守护中英双树的派生规则。
describe('路由与 SEO 配置契约', () => {
  const namedRoutes = routes.filter((r) => r.name)
  const enRoutes = namedRoutes.filter((r) => !String(r.name).endsWith(ZH_NAME_SUFFIX))
  const zhRoutes = namedRoutes.filter((r) => String(r.name).endsWith(ZH_NAME_SUFFIX))

  it('每个英文命名路由都有同名 SEO 条目、path 一致且 meta.locale=en', () => {
    for (const route of enRoutes) {
      const entry = SEO[route.name as SeoRouteKey]
      expect(entry, `路由 ${String(route.name)} 缺 SEO 条目`).toBeDefined()
      expect(entry.path, `路由 ${String(route.name)} 的 path 与 SEO 配置不一致`).toBe(route.path)
      expect(route.meta?.locale).toBe(Locale.EN)
    }
  })

  it('中文树路由 path = /zh + 英文 path、name = 基名 + _ZH 且 meta.locale=zh', () => {
    for (const route of zhRoutes) {
      const baseKey = String(route.name).slice(0, -ZH_NAME_SUFFIX.length) as SeoRouteKey
      const entry = SEO[baseKey]
      expect(entry, `中文路由 ${String(route.name)} 找不到基名 SEO 条目`).toBeDefined()
      expect(route.path).toBe(localizePath(entry.path, Locale.ZH))
      expect(route.meta?.locale).toBe(Locale.ZH)
    }
  })

  it('除 404 外每个英文路由都有对应中文路由；404 不生成中文树', () => {
    const zhNames = new Set(zhRoutes.map((r) => String(r.name)))
    for (const route of enRoutes) {
      if (route.name === 'NOT_FOUND') {
        expect(zhNames.has(`NOT_FOUND${ZH_NAME_SUFFIX}`)).toBe(false)
        continue
      }
      expect(
        zhNames.has(`${String(route.name)}${ZH_NAME_SUFFIX}`),
        `${String(route.name)} 缺中文对应路由`,
      ).toBe(true)
    }
  })

  it('每个 SEO 条目都对应真实路由（防 sitemap 产出 404 项）', () => {
    const routePaths = new Set(routes.map((r) => r.path))
    for (const [key, entry] of Object.entries(SEO)) {
      expect(routePaths.has(entry.path), `SEO ${key} 的 path ${entry.path} 不在路由表`).toBe(true)
    }
  })

  it('sitemap 可收录路径全部在路由表内', () => {
    const routePaths = new Set(routes.map((r) => r.path))
    for (const p of INDEXABLE_ROUTES) {
      expect(routePaths.has(p), `INDEXABLE ${p} 不在路由表`).toBe(true)
    }
  })
})

// 路由滚动不吃 CSS scroll-padding-top，锚点偏移必须由 scrollBehavior 显式返回；
// 少了 top 会让标题被吸顶 header 挡住一半（曾发生，防回潮）
describe('scrollBehavior 锚点偏移', () => {
  const routeAt = (hash: string) => ({ hash }) as RouteLocationNormalizedLoaded

  it('带锚点跳转返回 header 等高偏移与平滑滚动', () => {
    expect(scrollBehavior(routeAt('#terms'), routeAt(''), null)).toEqual({
      el: '#terms',
      top: ANCHOR_SCROLL_OFFSET,
      behavior: 'smooth',
    })
  })

  it('普通跳转回到页面顶部', () => {
    expect(scrollBehavior(routeAt(''), routeAt(''), null)).toEqual({ top: 0 })
  })
})
