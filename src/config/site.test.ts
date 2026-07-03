import { describe, expect, it } from 'vitest'

import { Locale, localizePath } from './locale'
import { SEO } from './seo'
import { absoluteUrl, INDEXABLE_ROUTES, SITE_URL } from './site'

describe('absoluteUrl', () => {
  it('把站内相对路径拼到站点域名后', () => {
    expect(absoluteUrl('/legal')).toBe(`${SITE_URL}/legal`)
  })

  it('根路径拼出站点根 URL', () => {
    expect(absoluteUrl('/')).toBe(`${SITE_URL}/`)
  })
})

describe('INDEXABLE_ROUTES', () => {
  it('对每个非 noindex 条目派生英文与中文两条路径', () => {
    const expected = Object.values(SEO)
      .filter((e) => !e.noindex)
      .flatMap((e) => [e.path, localizePath(e.path, Locale.ZH)])
    expect(INDEXABLE_ROUTES).toEqual(expected)
  })

  it('排除所有 noindex 路由（login/register 两种语言都不进 sitemap）', () => {
    expect(INDEXABLE_ROUTES).not.toContain(SEO.LOGIN.path)
    expect(INDEXABLE_ROUTES).not.toContain(localizePath(SEO.LOGIN.path, Locale.ZH))
    expect(INDEXABLE_ROUTES).not.toContain(SEO.REGISTER.path)
  })

  it('包含可收录路由的两种语言路径（home/legal）', () => {
    expect(INDEXABLE_ROUTES).toContain('/')
    expect(INDEXABLE_ROUTES).toContain('/zh')
    expect(INDEXABLE_ROUTES).toContain('/legal')
    expect(INDEXABLE_ROUTES).toContain('/zh/legal')
  })
})
