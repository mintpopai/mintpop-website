import { describe, expect, it } from 'vitest'

import { Locale, localizePath, stripLocale } from './locale'

describe('localizePath', () => {
  it('中文首页为 /zh（无尾斜杠）', () => {
    expect(localizePath('/', Locale.ZH)).toBe('/zh')
  })

  it('中文子页加 /zh 前缀', () => {
    expect(localizePath('/legal', Locale.ZH)).toBe('/zh/legal')
  })

  it('英文路径原样返回', () => {
    expect(localizePath('/legal', Locale.EN)).toBe('/legal')
    expect(localizePath('/', Locale.EN)).toBe('/')
  })
})

describe('stripLocale', () => {
  it('/zh 与 /zh/ 都还原为根路径', () => {
    expect(stripLocale('/zh')).toBe('/')
    expect(stripLocale('/zh/')).toBe('/')
  })

  it('/zh/legal 还原为 /legal', () => {
    expect(stripLocale('/zh/legal')).toBe('/legal')
  })

  it('英文路径原样返回', () => {
    expect(stripLocale('/legal')).toBe('/legal')
    expect(stripLocale('/')).toBe('/')
  })

  it('前缀必须整段匹配：/zhang 不剥', () => {
    expect(stripLocale('/zhang')).toBe('/zhang')
  })
})

describe('localizePath 与 stripLocale 互逆', () => {
  it('localize 后 strip 回到原路径', () => {
    for (const p of ['/', '/legal', '/login']) {
      expect(stripLocale(localizePath(p, Locale.ZH))).toBe(p)
      expect(stripLocale(localizePath(p, Locale.EN))).toBe(p)
    }
  })
})
