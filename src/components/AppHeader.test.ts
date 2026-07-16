import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import { STORAGE_KEY_LOCALE } from '@/composables/useLocale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

// 组件级守护：切换器指向对等路径且完整保留 query（UTM 归因）与锚点，点击写入偏好
async function mountAt(url: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(url)
  await router.isReady()
  return mount(AppHeader, { global: { plugins: [router, createAppI18n()] } })
}

describe('AppHeader 语言切换器', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('英文页：标签为「中文」，目标加 /zh 前缀并保留 query 与锚点', async () => {
    const wrapper = await mountAt('/legal?utm_source=twitter#contact')
    const link = wrapper.find('a.lang')
    expect(link.text()).toBe('中文')
    expect(link.attributes('href')).toBe('/zh/legal?utm_source=twitter#contact')
  })

  it('中文页：标签为 EN，目标去掉 /zh 前缀', async () => {
    const wrapper = await mountAt('/zh/legal')
    const link = wrapper.find('a.lang')
    expect(link.text()).toBe('EN')
    expect(link.attributes('href')).toBe('/legal')
  })

  it('点击切换器把目标语言写入偏好', async () => {
    const wrapper = await mountAt('/')
    await wrapper.find('a.lang').trigger('click')
    expect(localStorage.getItem(STORAGE_KEY_LOCALE)).toBe('zh')
  })
})

// 页头在非首页（如联系页）也会挂载，链接必须带首页路径前缀才能跨页可用
describe('AppHeader 导航链接', () => {
  it('联系我们指向独立联系页，中文页带 /zh 前缀', async () => {
    const en = await mountAt('/')
    expect(en.find('a.contact-link:not(.products-link)').attributes('href')).toBe('/contact')
    const zh = await mountAt('/zh')
    expect(zh.find('a.contact-link:not(.products-link)').attributes('href')).toBe('/zh/contact')
  })

  it('logo 锚点带首页路径前缀，非首页也能回到首页顶部', async () => {
    const wrapper = await mountAt('/contact')
    expect(wrapper.find('a.logo-link').attributes('href')).toBe('/#top')
  })

  it('产品页链接指向 /products，中文页带 /zh 前缀', async () => {
    const en = await mountAt('/')
    expect(en.find('a.products-link').attributes('href')).toBe('/products')
    const zh = await mountAt('/zh')
    expect(zh.find('a.products-link').attributes('href')).toBe('/zh/products')
  })
})
