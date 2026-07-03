import { beforeEach, describe, expect, it } from 'vitest'

import { Locale } from '@/config/locale'

import { readLocalePreference, rememberLocale, STORAGE_KEY_LOCALE } from './useLocale'

describe('语言偏好持久化', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('rememberLocale 把小写语言码写入 mint-locale', () => {
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
})
