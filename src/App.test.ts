import { createHead } from '@unhead/vue/client'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from '@/App.vue'
import { STORAGE_KEY_LOCALE } from '@/composables/useLocale'
import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

// 组件级守护：App.vue 挂载时的语言偏好回跳——回访用户打开另一语言页要带回偏好语言的
// 对等页；首访无偏好、偏好与当前语言一致、目标解析不到命名路由（catch-all 404）时都不得跳转。
// 关键守卫是 router.resolve(target).name 判空，防止把用户跳进 404。
async function mountAppAt(url: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  // 与 main.ts 的守卫保持一致：meta.locale 驱动 i18n（App 渲染的视图会取词条）
  const i18n = createAppI18n()
  router.beforeEach((to) => {
    i18n.global.locale.value = to.meta.locale ?? Locale.EN
  })
  await router.push(url)
  await router.isReady()
  mount(App, { global: { plugins: [router, i18n, createHead()] } })
  // onMounted 里的 router.replace 是异步导航（含目标视图的动态 import），等落定再断言
  await flushPromises()
  return router
}

describe('App 语言偏好回跳', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('首访无偏好：停留在当前页', async () => {
    const router = await mountAppAt('/legal')
    expect(router.currentRoute.value.path).toBe('/legal')
  })

  it('偏好与当前语言一致：不跳转', async () => {
    localStorage.setItem(STORAGE_KEY_LOCALE, Locale.ZH)
    const router = await mountAppAt('/zh')
    expect(router.currentRoute.value.path).toBe('/zh')
  })

  it('偏好中文打开英文页：带到对等中文页，且保留 query 与锚点', async () => {
    localStorage.setItem(STORAGE_KEY_LOCALE, Locale.ZH)
    const router = await mountAppAt('/legal?utm_source=x#contact')
    expect(router.currentRoute.value.fullPath).toBe('/zh/legal?utm_source=x#contact')
  })

  it('偏好英文打开中文页：带回对等英文页', async () => {
    localStorage.setItem(STORAGE_KEY_LOCALE, Locale.EN)
    const router = await mountAppAt('/zh/legal')
    expect(router.currentRoute.value.path).toBe('/legal')
  })

  it('catch-all 404 路径：目标解析不到命名路由，不跳转（防跳进 404）', async () => {
    localStorage.setItem(STORAGE_KEY_LOCALE, Locale.EN)
    const router = await mountAppAt('/zh/不存在的页面')
    expect(router.currentRoute.value.path).toBe('/zh/不存在的页面')
  })
})
