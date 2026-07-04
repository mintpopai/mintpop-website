import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

// 组件级守护：页脚「联系我们」指向独立联系页（而非旧的 /legal#contact 锚点）
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  return mount(AppFooter, { global: { plugins: [router, createAppI18n()] } })
}

describe('AppFooter 联系链接', () => {
  it('英文页指向 /contact', async () => {
    const wrapper = await mountAt('/')
    const hrefs = wrapper.findAll('nav.links a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/contact')
    expect(hrefs).not.toContain('/legal#contact')
  })

  it('中文页指向 /zh/contact', async () => {
    const wrapper = await mountAt('/zh')
    const hrefs = wrapper.findAll('nav.links a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/zh/contact')
  })
})
