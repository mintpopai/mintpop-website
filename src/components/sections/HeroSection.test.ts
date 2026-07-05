import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'

import HeroSection from './HeroSection.vue'

// 回归守护：中文 headline 含 {br} 而英文没有，两种语言的子节点数量不同。
// 客户端切换语言时 Vue 按位置复用无 key 的 span（patchFlag 仅 TEXT，静态 class 不重新 patch），
// 「文本」会接手原 vision 的 <span class="em">，丢失 em-accent 强调色（刷新后才恢复）。
describe('HeroSection headline 强调色', () => {
  it('初始英文：text 带 em-accent，vision/voice 只有 em', () => {
    const wrapper = mount(HeroSection, { global: { plugins: [createAppI18n()] } })
    expect(wrapper.find('.headline .em-accent').text()).toBe('text')
    const plain = wrapper.findAll('.headline .em:not(.em-accent)').map((s) => s.text())
    expect(plain).toEqual(['vision', 'voice'])
  })

  it('客户端从英文切到中文后，「文本」仍带 em-accent 强调色', async () => {
    const i18n = createAppI18n()
    const wrapper = mount(HeroSection, { global: { plugins: [i18n] } })
    i18n.global.locale.value = Locale.ZH
    await nextTick()
    const accent = wrapper.find('.headline .em-accent')
    expect(accent.exists()).toBe(true)
    expect(accent.text()).toBe('文本')
    const plain = wrapper.findAll('.headline .em:not(.em-accent)').map((s) => s.text())
    expect(plain).toEqual(['视觉', '语音'])
  })
})
