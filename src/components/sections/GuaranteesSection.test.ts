import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { Locale } from '@/config/locale'
import { createAppI18n } from '@/locales'

import GuaranteesSection from './GuaranteesSection.vue'

describe('GuaranteesSection', () => {
  it('渲染三项承诺，各带徽标', () => {
    const wrapper = mount(GuaranteesSection, { global: { plugins: [createAppI18n()] } })
    expect(wrapper.findAll('.item')).toHaveLength(3)
    const pills = wrapper.findAll('.pill').map((p) => p.text())
    expect(pills).toEqual(['Purity-tested · A+', 'Zero retention', 'Online now'])
    expect(wrapper.find('.title .em').text()).toBe('guarantee')
  })

  // 与 HeroSection 相同的回归守护：中英文标题子节点结构不同，靠 :key="locale" 整体重挂载
  it('客户端切换到中文后，标题与三个小标题的强调词跟随更新', async () => {
    const i18n = createAppI18n()
    const wrapper = mount(GuaranteesSection, { global: { plugins: [i18n] } })
    i18n.global.locale.value = Locale.ZH
    await nextTick()
    expect(wrapper.find('.title .em').text()).toBe('郑重承诺')
    const itemEms = wrapper.findAll('.item-title .em').map((s) => s.text())
    expect(itemEms).toEqual(['满血', '保持私密', '任何时刻'])
  })
})
