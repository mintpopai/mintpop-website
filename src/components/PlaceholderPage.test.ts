import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import PlaceholderPage from '@/components/PlaceholderPage.vue'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

// 组件级守护：catch-all 404 路由无 meta.locale，首页链接须在挂载后按 URL 前缀修正语言
// （水合期按英文渲染与预渲染 404 页一致，onMounted 后修正——见组件内注释）
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(PlaceholderPage, {
    props: { title: 'T', description: 'D' },
    global: { plugins: [router, createAppI18n()] },
  })
  // onMounted 修正 homeLocale 后等一帧让 RouterLink 重新渲染
  await nextTick()
  return wrapper
}

describe('PlaceholderPage 首页链接语言', () => {
  it('中文前缀的未知路径（catch-all）：挂载后返回链指向 /zh', async () => {
    const wrapper = await mountAt('/zh/不存在的页面')
    expect(wrapper.find('a.back').attributes('href')).toBe('/zh')
    expect(wrapper.find('a.logo-link').attributes('href')).toBe('/zh')
  })

  it('英文未知路径：返回链保持指向 /', async () => {
    const wrapper = await mountAt('/does-not-exist')
    expect(wrapper.find('a.back').attributes('href')).toBe('/')
  })

  it('带 meta.locale 的中文页（/zh/legal）：返回链指向 /zh', async () => {
    const wrapper = await mountAt('/zh/legal')
    expect(wrapper.find('a.back').attributes('href')).toBe('/zh')
  })

  it('显式 /404 路由（meta 为英文）：返回链指向 /', async () => {
    const wrapper = await mountAt('/404')
    expect(wrapper.find('a.back').attributes('href')).toBe('/')
  })
})
