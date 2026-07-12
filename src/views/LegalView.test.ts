import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import LegalView from '@/views/LegalView.vue'

// 组件级守护：协议页四份文件的锚点与页脚链接（/legal#terms 等）一一对应；
// 联系入口按需求走站内跳转到联系页，不放 mailto（品牌为 MintPop，源设计稿的 Mint AI 已替换）
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  // 生产环境由路由守卫按 meta.locale 同步语言（main.ts），测试无守卫，这里手动同步
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? Locale.EN
  return mount(LegalView, {
    global: { plugins: [router, i18n, createHead()] },
  })
}

describe('LegalView 协议页', () => {
  it('渲染与页脚链接对应的五个锚点区块', async () => {
    const wrapper = await mountAt('/legal')
    for (const id of ['terms', 'privacy', 'refund', 'aup', 'contact']) {
      expect(wrapper.find(`article#${id}`).exists(), `缺少锚点 #${id}`).toBe(true)
    }
  })

  it('联系区块是指向站内联系页的链接而非 mailto', async () => {
    const wrapper = await mountAt('/legal')
    expect(wrapper.find('a.contact-cta').attributes('href')).toBe('/contact')
    expect(wrapper.html()).not.toContain('mailto:')
  })

  it('侧栏疑问卡片指向站内联系页', async () => {
    const wrapper = await mountAt('/legal')
    expect(wrapper.find('a.side-card').attributes('href')).toBe('/contact')
  })

  it('条款正文中的支持邮箱取站点配置的 SUPPORT_EMAIL', async () => {
    const wrapper = await mountAt('/legal')
    expect(wrapper.text()).toContain('support@mintpop.ai')
  })

  it('品牌名为 MintPop，不残留源设计稿的 Mint AI 与旧邮箱', async () => {
    const wrapper = await mountAt('/legal')
    expect(wrapper.text()).toContain('MintPop')
    expect(wrapper.text()).not.toContain('Mint AI')
    expect(wrapper.text()).not.toContain('mintaiclub2025')
  })

  it('中文路由下渲染中文标题，联系链接指向 /zh/contact', async () => {
    const wrapper = await mountAt('/zh/legal')
    expect(wrapper.find('h1.title').text()).toBe('条款与政策')
    expect(wrapper.find('a.contact-cta').attributes('href')).toBe('/zh/contact')
  })
})
