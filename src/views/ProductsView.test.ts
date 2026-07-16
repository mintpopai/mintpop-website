import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { API_URL, SHOP_URL } from '@/config/site'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import ProductsView from '@/views/ProductsView.vue'

// 组件级守护：产品页渲染 API 与 Shop 两张在线产品大卡 + 一张 SOON 占位卡，
// CTA 分别外链到 API 平台与 Shop 商城
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  // 生产环境由路由守卫按 meta.locale 同步语言（main.ts），测试无守卫，这里手动同步
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? Locale.EN
  return mount(ProductsView, { global: { plugins: [router, i18n, createHead()] } })
}

describe('ProductsView 产品列表', () => {
  it('渲染两张在线产品卡与一张 SOON 占位卡', async () => {
    const wrapper = await mountAt('/products')
    expect(wrapper.findAll('article.product-card')).toHaveLength(3)
    expect(wrapper.findAll('article.product-card--soon')).toHaveLength(1)
    expect(wrapper.text()).toContain('MintPop API')
    expect(wrapper.text()).toContain('MintPop Shop')
  })

  it('CTA 分别外链到 API 平台与 Shop 商城，新窗口打开', async () => {
    const wrapper = await mountAt('/products')
    const ctas = wrapper.findAll('a.cta')
    expect(ctas.map((a) => a.attributes('href'))).toEqual([API_URL, SHOP_URL])
    for (const cta of ctas) {
      expect(cta.attributes('target')).toBe('_blank')
      expect(cta.attributes('rel')).toBe('noopener')
    }
  })

  it('SOON 占位卡没有 CTA', async () => {
    const wrapper = await mountAt('/products')
    expect(wrapper.find('article.product-card--soon').find('a').exists()).toBe(false)
  })

  it('英文路由渲染英文标题，且 h1 唯一', async () => {
    const wrapper = await mountAt('/products')
    const h1s = wrapper.findAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0]!.text()).toBe('All Products')
  })

  it('中文路由渲染中文标题', async () => {
    const wrapper = await mountAt('/zh/products')
    expect(wrapper.find('h1.title').text()).toBe('全部产品')
  })
})
