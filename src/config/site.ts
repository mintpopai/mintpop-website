import { Locale, localizePath } from './locale'
import { SEO } from './seo'

// 站点级常量:生产域名等绝对 URL 的唯一来源,改这里全站生效
export const SITE_URL = 'https://mintpop.ai'
export const SITE_NAME = 'MintPop'

// 控制台地址:Get Started 等入口跳转目标,改这里全站生效
export const CONSOLE_URL = 'https://console.mintpop.ai'

// 联系渠道:支持邮箱与 Telegram 群邀请链接,改这里全站生效
export const SUPPORT_EMAIL = 'support@mintpop.ai'
export const TELEGRAM_GROUP_URL = 'https://t.me/+NpAwBIWXs8FkMzVh'

// 相对站点根的静态资源路径
export const OG_IMAGE_PATH = '/og-image.png'
export const BRAND_LOGO_PATH = '/favicon.png'

// 允许被搜索引擎收录、写入 sitemap 的路由 —— 从 SEO 配置派生，单一真相。
// 每个非 noindex 条目派生英文 + 中文两条路径；noindex 路由（login/register）自动排除。
export const INDEXABLE_ROUTES = Object.values(SEO)
  .filter((e) => !e.noindex)
  .flatMap((e) => [e.path, localizePath(e.path, Locale.ZH)])

/** 把站内相对路径拼成绝对 URL(用于 canonical / og:url / og:image 等) */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}
