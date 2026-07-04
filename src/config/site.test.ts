import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

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

// 路径经变量传入,避开 Vite 对 new URL('字面量', import.meta.url) 的静态资产重写
// (重写后不再是 file: URL,fileURLToPath 会抛错;与 useTheme.test.ts 同一模式)
const readRepoFile = (relPath: string) =>
  readFileSync(fileURLToPath(new URL(relPath, import.meta.url)), 'utf8')

// 跨文件契约守护:robots.txt 是静态文件,里面的 Sitemap 绝对 URL 无法 import SITE_URL,
// 只能手抄一份——SITE_URL 变更时这里锁死两处一致(与 index.html 主题键的守护同一模式)
describe('跨文件站点契约(public/robots.txt)', () => {
  it('robots.txt 的 Sitemap 指向 SITE_URL 下的 sitemap.xml', () => {
    const robots = readRepoFile('../../public/robots.txt')
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
  })
})
