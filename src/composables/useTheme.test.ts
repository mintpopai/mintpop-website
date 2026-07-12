import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// 用 node:fs 直读文件原文（类型环境为 tsconfig.vitest.json，带 node types）。
// 不用 Vite 的 ?raw：Vitest 默认 mock CSS 模块，theme.css?raw 会拿到空字符串。
const readRepoFile = (relPath: string) =>
  readFileSync(fileURLToPath(new URL(relPath, import.meta.url)), 'utf8')

// useTheme 是模块级单例(theme/accent 为模块内 ref)。为避免测试间状态串扰,
// 每个用例都 resetModules 后重新 import,拿到全新的单例。
async function freshTheme() {
  vi.resetModules()
  const mod = await import('./useTheme')
  return mod
}

// 控制 matchMedia 的系统深色偏好返回值(jsdom 无此 API,setup 已 stub,这里按用例覆盖)
function stubPrefersDark(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  // 默认"不偏好深色",个别用例再覆盖
  stubPrefersDark(false)
})

describe('Theme 枚举', () => {
  it('成员名与字符串取值统一为 SCREAMING_SNAKE_CASE 且逐字一致', async () => {
    const { Theme } = await freshTheme()
    expect(Theme.LIGHT).toBe('LIGHT')
    expect(Theme.DARK).toBe('DARK')
  })
})

describe('toggleTheme', () => {
  it('从浅色切到深色,持久化到 localStorage 并写入 document', async () => {
    const { useTheme } = await freshTheme()
    const { theme, toggleTheme } = useTheme()

    expect(theme.value).toBe('LIGHT')
    toggleTheme()

    expect(theme.value).toBe('DARK')
    expect(localStorage.getItem('mintpop-theme')).toBe('DARK')
    expect(document.documentElement.dataset.theme).toBe('DARK')
  })

  it('再次切换回浅色', async () => {
    const { useTheme } = await freshTheme()
    const { theme, toggleTheme } = useTheme()

    toggleTheme()
    toggleTheme()

    expect(theme.value).toBe('LIGHT')
    expect(localStorage.getItem('mintpop-theme')).toBe('LIGHT')
  })
})

describe('syncTheme / resolveInitialTheme', () => {
  it('localStorage 有有效记录时优先采用', async () => {
    localStorage.setItem('mintpop-theme', 'DARK')
    const { useTheme } = await freshTheme()
    const { theme, syncTheme } = useTheme()

    syncTheme()
    expect(theme.value).toBe('DARK')
  })

  it('无记录且系统偏好深色时取深色', async () => {
    stubPrefersDark(true)
    const { useTheme } = await freshTheme()
    const { theme, syncTheme } = useTheme()

    syncTheme()
    expect(theme.value).toBe('DARK')
  })

  it('无记录且系统不偏好深色时回退浅色', async () => {
    const { useTheme } = await freshTheme()
    const { theme, syncTheme } = useTheme()

    syncTheme()
    expect(theme.value).toBe('LIGHT')
  })

  it('localStorage 记录非法值时忽略,回退系统偏好', async () => {
    localStorage.setItem('mintpop-theme', 'PURPLE')
    const { useTheme } = await freshTheme()
    const { theme, syncTheme } = useTheme()

    syncTheme()
    expect(theme.value).toBe('LIGHT')
  })
})

// 隐私模式/禁用站点数据时 localStorage 方法会抛 SecurityError——
// 主题功能须整体降级(当次会话仍可切换,只丢跨会话记忆),不得抛错中断调用方
// (syncTheme 抛错会连带中断 App.vue onMounted 里后续的语言偏好回跳)。
describe('存储不可用(隐私模式)', () => {
  // stubGlobal 不自动恢复;不还原会让后续用例的 localStorage.clear() 炸掉
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function stubThrowingStorage() {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
      setItem: () => {
        throw new DOMException('denied', 'SecurityError')
      },
    })
  }

  it('toggleTheme 不抛错,主题仍切换并写入 document', async () => {
    const { useTheme } = await freshTheme()
    const { theme, toggleTheme } = useTheme()
    stubThrowingStorage()

    expect(() => toggleTheme()).not.toThrow()
    expect(theme.value).toBe('DARK')
    expect(document.documentElement.dataset.theme).toBe('DARK')
  })

  it('syncTheme 不抛错,回退系统偏好', async () => {
    const { useTheme } = await freshTheme()
    const { theme, syncTheme } = useTheme()
    stubThrowingStorage()

    expect(() => syncTheme()).not.toThrow()
    expect(theme.value).toBe('LIGHT')
  })
})

// 跨文件契约守护:主题的存储键与枚举取值被 index.html 的防闪烁内联脚本、
// theme.css 的深色选择器各复制了一份(前者无法 import 模块,后者是 CSS)。
// 任何一侧改名而其它侧未同步,主题记忆/防闪烁/深色配色会静默失效,
// 这里通过直接读取文件内容锁死三处一致。
describe('跨文件主题契约(index.html / theme.css)', () => {
  it('index.html 防闪烁脚本使用相同的存储键与主题取值', async () => {
    const { STORAGE_KEY_THEME, Theme } = await freshTheme()
    const indexHtml = readRepoFile('../../index.html')

    expect(indexHtml).toContain(`localStorage.getItem('${STORAGE_KEY_THEME}')`)
    expect(indexHtml).toContain(`'${Theme.LIGHT}'`)
    expect(indexHtml).toContain(`'${Theme.DARK}'`)
  })

  it('theme.css 深色覆盖选择器与 Theme.DARK 取值一致', async () => {
    const { Theme } = await freshTheme()
    const themeCss = readRepoFile('../styles/theme.css')

    expect(themeCss).toContain(`:root[data-theme='${Theme.DARK}']`)
  })
})
