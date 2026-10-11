import { createHead } from '@unhead/vue/client'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import ContactView from '@/views/ContactView.vue'

// 组件级守护：联系页暴露邮件支持、Telegram 群链接与微信二维码三个渠道；
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

  it('微信卡片渲染二维码图片并带无障碍替代文本', async () => {
    const wrapper = await mountAt('/contact')
    const qr = wrapper.find('img.im-qr')
    expect(qr.attributes('src')).toContain('wechat-qr')
    expect(qr.attributes('alt')).toBe('MintPop WeChat QR code')
  })

  it('IM 卡片默认展示微信渠道，微信 tab 处于按下态', async () => {
    const wrapper = await mountAt('/contact')
    const tabs = wrapper.findAll('button.im-tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0]!.attributes('aria-pressed')).toBe('true')
    expect(tabs[1]!.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('img.im-qr').attributes('src')).toContain('wechat-qr')
  })

  it('点击 QQ tab 切换为 QQ 群二维码，并展示群号', async () => {
    const wrapper = await mountAt('/contact')
    const tabs = wrapper.findAll('button.im-tab')
    await tabs[1]!.trigger('click')
    await flushPromises()
    const qr = wrapper.find('img.im-qr')
    expect(qr.attributes('src')).toContain('qq-qr')
    expect(qr.attributes('alt')).toBe('MintPop QQ group QR code')
    expect(tabs[1]!.attributes('aria-pressed')).toBe('true')
    expect(tabs[0]!.attributes('aria-pressed')).toBe('false')
    expect(wrapper.text()).toContain('1063651825')
  })

  it('QQ 群号是可点击复制的按钮，点击后写入剪贴板并给出已复制反馈', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountAt('/zh/contact')
    await wrapper.findAll('button.im-tab')[1]!.trigger('click')
    await flushPromises()
    const btn = wrapper.find('button.copy-id')
    expect(btn.text()).toContain('1063651825')
    await btn.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('1063651825')
    expect(btn.classes()).toContain('copy-id--done')
  })

  it('微信说明里展示可点击复制的微信号', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountAt('/zh/contact')
    const btn = wrapper.find('button.copy-id')
    expect(btn.text()).toContain('Mintpop_ai')
    expect(btn.attributes('aria-label')).toBe('复制微信号')
    await btn.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('Mintpop_ai')
    expect(btn.classes()).toContain('copy-id--done')
  })

  it('切到 QQ 后可再切回微信', async () => {
    const wrapper = await mountAt('/contact')
    const tabs = wrapper.findAll('button.im-tab')
    await tabs[1]!.trigger('click')
    await flushPromises()
    await tabs[0]!.trigger('click')
    await flushPromises()
    expect(wrapper.find('img.im-qr').attributes('src')).toContain('wechat-qr')
    expect(wrapper.text()).not.toContain('1063651825')
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
