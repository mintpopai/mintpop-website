import { vi } from 'vitest'

// jsdom 未实现 window.matchMedia —— useTheme.resolveInitialTheme() 在无 localStorage 记录时
// 会读取系统深色偏好,直接调用会抛错。这里 stub 成"不偏好深色",让测试可控制其返回。
vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
)

// jsdom 同样未实现 IntersectionObserver —— LegalView 的目录滚动侦测在 onMounted 里
// `new IntersectionObserver(...)`，缺 stub 会让所有挂载该组件的测试直接抛错。
// stub 为惰性实现（不触发回调），测试中目录保持无激活项即可；须用 class（可被 new）。
class IntersectionObserverStub {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
