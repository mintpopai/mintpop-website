import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import ContactView from '@/views/ContactView.vue'

// 组件级守护：联系页只暴露邮件支持与 Telegram 群链接两个渠道；
// 个人账号 @Mintpop_Jack 已按需求移除，断言防止回潮
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  // 生产环境由路由守卫按 meta.locale 同步语言（main.ts），测试无守卫，这里手动同步
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? Locale.EN
  return mount(ContactView, {
    global: { plugins: [router, i18n, createHead()] },
  })
}

describe('ContactView 联系渠道', () => {
  it('渲染邮件支持的 mailto 链接', async () => {
    const wrapper = await mountAt('/contact')
    const mail = wrapper.find('a.email')
    expect(mail.attributes('href')).toBe('mailto:support@mintpop.ai')
    expect(mail.text()).toBe('support@mintpop.ai')
  })

  it('Telegram 卡片是指向群邀请链接的新窗口外链', async () => {
    const wrapper = await mountAt('/contact')
    const tg = wrapper.find('a.tg-link')
    expect(tg.attributes('href')).toBe('https://t.me/+NpAwBIWXs8FkMzVh')
    expect(tg.attributes('target')).toBe('_blank')
    expect(tg.attributes('rel')).toBe('noopener')
  })

  it('页面不出现个人账号 Mintpop_Jack', async () => {
    const wrapper = await mountAt('/contact')
    expect(wrapper.text()).not.toContain('Mintpop_Jack')
  })

  it('中文路由下渲染中文标题', async () => {
    const wrapper = await mountAt('/zh/contact')
    expect(wrapper.find('h1.title').text()).toBe('联系我们')
  })
})
