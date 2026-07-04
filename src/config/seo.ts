import { Locale } from './locale'

// 每个路由的 SEO 文案：路径 / 是否禁止收录 / 各语言 title+description
export type SeoRouteKey = 'HOME' | 'CONTACT' | 'LEGAL' | 'LOGIN' | 'REGISTER' | 'NOT_FOUND'

export interface SeoCopy {
  title: string
  description: string
}

export interface SeoEntry {
  /** 英文基准路径 —— 路径单一来源，中文路径由 localizePath 派生 */
  path: string
  /** 为 true 时输出 robots=noindex、不进 sitemap、不挂 hreflang */
  noindex?: boolean
  /** 各语言文案 */
  copy: Record<Locale, SeoCopy>
}

export const SEO: Record<SeoRouteKey, SeoEntry> = {
  HOME: {
    path: '/',
    copy: {
      [Locale.EN]: {
        title: 'MintPop — One API for text, vision, and voice',
        description:
          'MintPop — multimodal AI infrastructure for developers. Build text, vision, and voice into your product through a single, unified endpoint.',
      },
      [Locale.ZH]: {
        title: 'MintPop — 一个 API，打通文本、视觉与语音',
        description:
          'MintPop——面向开发者的多模态 AI 基础设施。通过单一统一端点，把文本、视觉与语音能力构建进你的产品。',
      },
    },
  },
  CONTACT: {
    path: '/contact',
    copy: {
      [Locale.EN]: {
        title: 'Contact — MintPop',
        description:
          'Contact MintPop — email support and Telegram group for billing, account, credit-limit, and compliance questions.',
      },
      [Locale.ZH]: {
        title: '联系我们 — MintPop',
        description: '联系 MintPop——邮件支持与 Telegram 群，解答账单、账户、额度与合规相关问题。',
      },
    },
  },
  LEGAL: {
    path: '/legal',
    copy: {
      [Locale.EN]: {
        title: 'Legal — MintPop',
        description:
          'Terms of Service, Privacy Policy, Refund Policy, Acceptable Use and contact details for MintPop.',
      },
      [Locale.ZH]: {
        title: '法律条款 — MintPop',
        description: 'MintPop 的服务条款、隐私政策、退款政策、可接受使用政策及联系方式。',
      },
    },
  },
  LOGIN: {
    path: '/login',
    noindex: true,
    copy: {
      [Locale.EN]: {
        title: 'Login — MintPop',
        description: 'Sign in to your MintPop account.',
      },
      [Locale.ZH]: {
        title: '登录 — MintPop',
        description: '登录你的 MintPop 账户。',
      },
    },
  },
  REGISTER: {
    path: '/register',
    noindex: true,
    copy: {
      [Locale.EN]: {
        title: 'Get Started — MintPop',
        description: 'Create a MintPop account and start building multimodal AI.',
      },
      [Locale.ZH]: {
        title: '开始使用 — MintPop',
        description: '创建 MintPop 账户，开始构建多模态 AI。',
      },
    },
  },
  // 预渲染出 dist/404/index.html，nginx error_page 用它对未知路径返回真实 404（仅英文一份，页内双语）
  NOT_FOUND: {
    path: '/404',
    noindex: true,
    copy: {
      [Locale.EN]: {
        title: 'Page Not Found — MintPop',
        description: "The page you're looking for doesn't exist or has moved.",
      },
      [Locale.ZH]: {
        title: '页面未找到 — MintPop',
        description: '你要找的页面不存在或已被移动。',
      },
    },
  },
}
