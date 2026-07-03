import { describe, expect, it } from 'vitest'

import { Locale } from '@/config/locale'
import { SITE_URL } from '@/config/site'

import { buildSeoHead } from './useSeo'

describe('buildSeoHead', () => {
  it('英文页：canonical 指向英文 URL，lang=en，og:locale=en_US', () => {
    const head = buildSeoHead('LEGAL', Locale.EN)
    expect(head.htmlAttrs.lang).toBe('en')
    expect(head.link).toContainEqual({ rel: 'canonical', href: `${SITE_URL}/legal` })
    expect(head.meta).toContainEqual({ property: 'og:locale', content: 'en_US' })
    expect(head.title).toContain('Legal')
  })

  it('中文页：canonical 指向 /zh URL，lang=zh-CN，og:locale=zh_CN，文案用中文', () => {
    const head = buildSeoHead('LEGAL', Locale.ZH)
    expect(head.htmlAttrs.lang).toBe('zh-CN')
    expect(head.link).toContainEqual({ rel: 'canonical', href: `${SITE_URL}/zh/legal` })
    expect(head.meta).toContainEqual({ property: 'og:locale', content: 'zh_CN' })
    expect(head.title).toContain('法律条款')
  })

  it('可收录页输出 en/zh/x-default 三条 hreflang，x-default 指英文', () => {
    for (const locale of [Locale.EN, Locale.ZH]) {
      const head = buildSeoHead('HOME', locale)
      expect(head.link).toContainEqual({
        rel: 'alternate',
        hreflang: 'en',
        href: `${SITE_URL}/`,
      })
      expect(head.link).toContainEqual({
        rel: 'alternate',
        hreflang: 'zh',
        href: `${SITE_URL}/zh`,
      })
      expect(head.link).toContainEqual({
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${SITE_URL}/`,
      })
    }
  })

  it('noindex 页输出 robots=noindex，且不挂 hreflang', () => {
    const head = buildSeoHead('LOGIN', Locale.ZH)
    expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex' })
    expect(head.link.filter((l) => l.rel === 'alternate')).toHaveLength(0)
  })

  it('og/twitter 文案与本语言 title/description 一致', () => {
    const head = buildSeoHead('HOME', Locale.ZH)
    const ogTitle = head.meta.find((m) => m.property === 'og:title')
    const twTitle = head.meta.find((m) => m.name === 'twitter:title')
    expect(ogTitle?.content).toBe(head.title)
    expect(twTitle?.content).toBe(head.title)
  })
})
