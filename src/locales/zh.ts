import type en from './en'

// 中文词条 —— 结构与 en.ts 同构（typeof en 约束），漏译在编译期报错
const zh: typeof en = {
  nav: {
    capabilities: '能力',
    modalities: '模态',
    legal: '法律条款',
    contact: '联系我们',
    login: '登录',
    switchToLight: '切换到浅色主题',
    switchToDark: '切换到深色主题',
    switchLocale: '切换语言',
  },
  hero: {
    badge: 'MintPop\u00A0·\u00A0面向开发者的多模态 AI 基础设施',
    headline: '一个 API，打通{text}、{vision}与{voice}。',
    text: '文本',
    vision: '视觉',
    voice: '语音',
    getStarted: '立即开始',
    explore: '了解能力',
    tagUnifiedApi: '统一 API',
    tagSession: '会话持久化',
    tagPayg: '按量付费',
  },
  capabilities: {
    heading: '核心能力',
    accessTitle: '一键接入',
    accessDesc: '一把 API Key 调用全部能力，无需维护多个账号。',
    reliableTitle: '稳定可靠',
    reliableDesc: '智能路由与自动故障切换，保障请求持续畅通。',
    billingTitle: '按用量计费',
    billingDesc: '只为实际用量付费，支持额度上限与完整的消耗明细。',
  },
  modalities: {
    title: '一个 API，覆盖所有模态',
    subtitle: '一次构建，跨模态交付。',
    text: '文本',
    vision: '视觉',
    voice: '语音',
    more: '更多',
    supported: '已支持',
    soon: '敬请期待',
  },
  contact: {
    title: '联系我们',
    intro:
      'MintPop 是面向海外开发者与跨境团队的 API 中转与额度管理服务。你可以通过以下任一渠道联系我们——通常会在一个工作日内回复。',
    emailLabel: '邮件支持',
    emailDesc: '账单、账户、额度上限与合规相关问题。',
    telegramLabel: 'Telegram',
    telegramJoin: '加入我们的 Telegram 群',
  },
  footer: {
    terms: '服务条款',
    privacy: '隐私政策',
    refund: '退款政策',
    aup: '可接受使用政策',
    contact: '联系我们',
    operatedBy: '运营方',
    location: '美国',
    copyright: '© 2026 MintPop. 保留所有权利。',
  },
  placeholder: {
    soonTag: '即将上线',
    back: '返回首页',
    legalTitle: '法律条款',
    legalDesc: '服务条款、隐私政策、退款政策、可接受使用政策与联系方式将在设计就绪后呈现于此。',
    loginTitle: '登录',
    loginDesc: '登录功能即将上线，页面设计尚未就绪。',
    registerTitle: '开始使用',
    registerDesc: '注册功能即将上线，页面设计尚未就绪。',
  },
}

export default zh
