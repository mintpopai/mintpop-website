import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

import HeroSection from './HeroSection.vue'

// 组件用到 useLocale（依赖当前路由），挂载需带真实路由；语言按路由 meta 同步
async function mountAt(url: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(url)
  await router.isReady()
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? Locale.EN
  const wrapper = mount(HeroSection, { global: { plugins: [router, i18n] } })
  return { wrapper, i18n }
}

// 回归守护：中文 headline 含 {br} 而英文没有，两种语言的子节点数量不同。
// 客户端切换语言时 Vue 按位置复用无 key 的 span（patchFlag 仅 TEXT，静态 class 不重新 patch），
// 「文本」会接手原 vision 的 <span class="em">，丢失 em-accent 强调色（刷新后才恢复）。
describe('HeroSection headline 强调色', () => {
  it('初始英文：text 带 em-accent，vision/voice 只有 em', async () => {
    const { wrapper } = await mountAt('/')
    expect(wrapper.find('.headline .em-accent').text()).toBe('text')
    const plain = wrapper.findAll('.headline .em:not(.em-accent)').map((s) => s.text())
    expect(plain).toEqual(['vision', 'voice'])
  })

  it('客户端从英文切到中文后，「文本」仍带 em-accent 强调色', async () => {
    const { wrapper, i18n } = await mountAt('/')
    i18n.global.locale.value = Locale.ZH
    await nextTick()
    const accent = wrapper.find('.headline .em-accent')
    expect(accent.exists()).toBe(true)
    expect(accent.text()).toBe('文本')
    const plain = wrapper.findAll('.headline .em:not(.em-accent)').map((s) => s.text())
    expect(plain).toEqual(['视觉', '语音'])
  })
})

describe('HeroSection CTA', () => {
  it('主按钮外链 API 平台，次级按钮指向本语言树的产品页', async () => {
    const en = await mountAt('/')
    expect(en.wrapper.find('a.btn-primary').attributes('href')).toBe('https://api.mintpop.ai')
    expect(en.wrapper.find('a.btn-secondary').attributes('href')).toBe('/products')
    const zh = await mountAt('/zh')
    expect(zh.wrapper.find('a.btn-secondary').attributes('href')).toBe('/zh/products')
  })
})
