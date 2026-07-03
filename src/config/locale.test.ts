import { describe, expect, it } from 'vitest'

import { Locale, localeSwitchTarget, localizePath, pathLocale, stripLocale } from './locale'

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

describe('localeSwitchTarget', () => {
  it('英文子页切到中文：加 /zh 前缀', () => {
    expect(localeSwitchTarget('/legal', {}, '', Locale.ZH)).toEqual({
      path: '/zh/legal',
      query: {},
      hash: '',
    })
  })

  it('中文子页切到英文并保留锚点', () => {
    expect(localeSwitchTarget('/zh/legal', {}, '#contact', Locale.EN)).toEqual({
      path: '/legal',
      query: {},
      hash: '#contact',
    })
  })

  it('英文首页切到中文：/ → /zh', () => {
    expect(localeSwitchTarget('/', {}, '', Locale.ZH)).toEqual({ path: '/zh', query: {}, hash: '' })
  })

  it('中文首页切到英文：/zh → /', () => {
    expect(localeSwitchTarget('/zh', {}, '', Locale.EN)).toEqual({ path: '/', query: {}, hash: '' })
  })

  it('保留 query 参数：UTM 等统计参数切换语言不丢失', () => {
    const query = { utm_source: 'twitter', utm_campaign: 'launch' }
    expect(localeSwitchTarget('/', query, '', Locale.ZH)).toEqual({
      path: '/zh',
      query,
      hash: '',
    })
  })

  it('query 与锚点同时保留', () => {
    expect(localeSwitchTarget('/zh/legal', { ref: 'x' }, '#contact', Locale.EN)).toEqual({
      path: '/legal',
      query: { ref: 'x' },
      hash: '#contact',
    })
  })
})

describe('pathLocale', () => {
  it('/zh 与 /zh/ 及其子路径判定为中文', () => {
    expect(pathLocale('/zh')).toBe(Locale.ZH)
    expect(pathLocale('/zh/')).toBe(Locale.ZH)
    expect(pathLocale('/zh/legal')).toBe(Locale.ZH)
    expect(pathLocale('/zh/不存在')).toBe(Locale.ZH)
  })

  it('无前缀路径判定为英文', () => {
    expect(pathLocale('/')).toBe(Locale.EN)
    expect(pathLocale('/legal')).toBe(Locale.EN)
    expect(pathLocale('/404')).toBe(Locale.EN)
  })

  it('前缀必须整段匹配：/zhang 判定为英文', () => {
    expect(pathLocale('/zhang')).toBe(Locale.EN)
  })
})
