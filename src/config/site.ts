import { Locale, localizePath } from './locale'
import { SEO } from './seo'

// 站点级常量:生产域名等绝对 URL 的唯一来源,改这里全站生效
export const SITE_URL = 'https://mintpop.ai'
export const SITE_NAME = 'MintPop'

// API 平台地址:Get Started / 登录等入口跳转目标,改这里全站生效
export const API_URL = 'https://api.mintpop.ai'

// 联系渠道:支持邮箱与 Telegram 群邀请链接,改这里全站生效
export const SUPPORT_EMAIL = 'support@mintpop.ai'
export const TELEGRAM_GROUP_URL = 'https://t.me/+NpAwBIWXs8FkMzVh'

// 相对站点根的静态资源路径（og-image 是本站专属社交分享图，非品牌通用物料，仍本地托管）
export const OG_IMAGE_PATH = '/og-image.png'

// 品牌物料统一引用规范中心（standards.mintpop.ai）线上的同一份，本仓不存本地副本。
// 注意 index.html 的 favicon / apple-touch-icon 是静态 HTML、无法 import，此处 URL 在那里各写了一份。
export const BRAND_ASSETS_BASE = 'https://standards.mintpop.ai/assets/brand'
export const BRAND_ICON_URL = `${BRAND_ASSETS_BASE}/app-icon/mintpop-app-cloud.png`
export const BRAND_WORDMARK_DARK_URL = `${BRAND_ASSETS_BASE}/wordmark/mintpop-wordmark-dark.png`
export const BRAND_WORDMARK_LIGHT_URL = `${BRAND_ASSETS_BASE}/wordmark/mintpop-wordmark-light.png`

// 允许被搜索引擎收录、写入 sitemap 的路由 —— 从 SEO 配置派生，单一真相。
// 每个非 noindex 条目派生英文 + 中文两条路径；noindex 路由（login/register）自动排除。
export const INDEXABLE_ROUTES = Object.values(SEO)
  .filter((e) => !e.noindex)
  .flatMap((e) => [e.path, localizePath(e.path, Locale.ZH)])

/** 把站内相对路径拼成绝对 URL(用于 canonical / og:url / og:image 等) */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}
