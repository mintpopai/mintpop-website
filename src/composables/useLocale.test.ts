import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Locale } from '@/config/locale'

import { readLocalePreference, rememberLocale, STORAGE_KEY_LOCALE } from './useLocale'

describe('语言偏好持久化', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('rememberLocale 把小写语言码写入 mintpop-locale', () => {
    rememberLocale(Locale.ZH)
    expect(localStorage.getItem(STORAGE_KEY_LOCALE)).toBe('zh')
  })

  it('readLocalePreference 读回写入的偏好', () => {
    rememberLocale(Locale.EN)
    expect(readLocalePreference()).toBe(Locale.EN)
  })

  it('无记录时返回 null', () => {
    expect(readLocalePreference()).toBeNull()
  })

  it('值非法（历史脏数据）时返回 null', () => {
    localStorage.setItem(STORAGE_KEY_LOCALE, 'ja')
    expect(readLocalePreference()).toBeNull()
  })

  // 隐私模式/禁用站点数据时 localStorage 方法抛 SecurityError,偏好功能须静默降级
  describe('存储不可用(隐私模式)', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('rememberLocale 不抛错;readLocalePreference 返回 null', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => {
          throw new DOMException('denied', 'SecurityError')
        },
        setItem: () => {
          throw new DOMException('denied', 'SecurityError')
        },
      })

      expect(() => rememberLocale(Locale.ZH)).not.toThrow()
      expect(readLocalePreference()).toBeNull()
    })
  })
})
