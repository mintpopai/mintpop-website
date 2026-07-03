import { describe, expect, it } from 'vitest'

import en from './en'
import zh from './zh'

// 递归拍平嵌套词条为 'a.b.c' 键列表
function flatEntries(obj: Record<string, unknown>, prefix = ''): [string, unknown][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return typeof v === 'object' && v !== null
      ? flatEntries(v as Record<string, unknown>, key)
      : [[key, v] as [string, unknown]]
  })
}

// zh 的结构已由 typeof en 在编译期约束；此测试作运行时守护，防 any 逃逸或键漂移
describe('词条完整性', () => {
  it('zh 与 en 的键集合完全一致', () => {
    const enKeys = flatEntries(en).map(([k]) => k)
    const zhKeys = flatEntries(zh).map(([k]) => k)
    expect(zhKeys.sort()).toEqual(enKeys.sort())
  })

  it('两种语言所有词条均为非空字符串', () => {
    for (const messages of [en, zh]) {
      for (const [key, value] of flatEntries(messages)) {
        expect(typeof value, `${key} 不是字符串`).toBe('string')
        expect((value as string).length, `${key} 为空`).toBeGreaterThan(0)
      }
    }
  })
})
