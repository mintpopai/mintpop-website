import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { createAppI18n } from '@/locales'

import PurityReportSection from './PurityReportSection.vue'

describe('PurityReportSection', () => {
  it('渲染四张统计卡与 veridrop 验证外链', () => {
    const wrapper = mount(PurityReportSection, { global: { plugins: [createAppI18n()] } })
    expect(wrapper.findAll('.stat')).toHaveLength(4)
    expect(wrapper.find('.stat-hero .stat-value').text()).toBe('A+')
    const link = wrapper.find('a.chip-verified')
    expect(link.attributes('href')).toBe('https://veridrop.org/leaderboard/mintpop.ai')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
  })

  it('八项关键检查的通过率与计数由数据计算得出', () => {
    const wrapper = mount(PurityReportSection, { global: { plugins: [createAppI18n()] } })
    const rates = wrapper.findAll('.check-rate').map((s) => s.text())
    expect(rates).toEqual([
      '100.0%',
      '100.0%',
      '100.0%',
      '100.0%',
      '100.0%',
      '96.2%',
      '96.2%',
      '96.2%',
    ])
    const counts = wrapper.findAll('.check-count').map((s) => s.text())
    expect(counts[0]).toBe('26 / 26')
    expect(counts[7]).toBe('25 / 26')
    // 满分项与非满分项的配色区分
    expect(wrapper.findAll('.check-rate-full')).toHaveLength(5)
  })
})
