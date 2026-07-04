import { describe, expect, it } from 'vitest'

import { Locale } from './locale'
import { SEO, type SeoRouteKey } from './seo'

const ALL_KEYS: SeoRouteKey[] = ['HOME', 'CONTACT', 'LEGAL', 'LOGIN', 'REGISTER', 'NOT_FOUND']
const ALL_LOCALES = [Locale.EN, Locale.ZH]

describe('SEO 配置', () => {
  it('路由 key 齐全', () => {
    expect(Object.keys(SEO).sort()).toEqual([...ALL_KEYS].sort())
  })

  it('每条都有非空 path，且两种语言的 title/description 均非空', () => {
    for (const key of ALL_KEYS) {
      const entry = SEO[key]
      expect(entry.path).toMatch(/^\//)
      for (const locale of ALL_LOCALES) {
        expect(entry.copy[locale].title.length, `${key}.${locale}.title 为空`).toBeGreaterThan(0)
        expect(
          entry.copy[locale].description.length,
          `${key}.${locale}.description 为空`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it('path 是英文基准路径（不带 /zh 前缀）', () => {
    for (const key of ALL_KEYS) {
      expect(SEO[key].path.startsWith('/zh')).toBe(false)
    }
  })

  it('login/register/404 标了 noindex，home/legal 未标', () => {
    expect(SEO.LOGIN.noindex).toBe(true)
    expect(SEO.REGISTER.noindex).toBe(true)
    expect(SEO.NOT_FOUND.noindex).toBe(true)
    expect(SEO.HOME.noindex).toBeUndefined()
    expect(SEO.LEGAL.noindex).toBeUndefined()
  })

  it('path 互不重复', () => {
    const paths = ALL_KEYS.map((k) => SEO[k].path)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
