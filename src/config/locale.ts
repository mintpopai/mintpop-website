/**
 * 语言常量：成员名按全局规范用 SCREAMING_SNAKE_CASE；
 * 取值是小写 BCP-47 码（'en'/'zh'）——要进 URL、<html lang> 与 vue-i18n API，
 * 均为外部标准要求小写，按「技术符号例外」处理（见 i18n 设计文档）。
 */
export const Locale = {
  EN: 'en',
  ZH: 'zh',
} as const

export type Locale = (typeof Locale)[keyof typeof Locale]

/** 中文路由前缀：语言由 URL 唯一决定的锚点 */
export const ZH_PREFIX = '/zh'

/** 语言切换器的显示标签：展示目标语言自己的名字 */
export const LOCALE_LABELS: Record<Locale, string> = {
  [Locale.EN]: 'EN',
  [Locale.ZH]: '中文',
}

/** 把「无语言前缀的基准路径」本地化成目标语言路径：'/legal'+zh → '/zh/legal'；'/'+zh → '/zh' */
export function localizePath(path: string, locale: Locale): string {
  if (locale === Locale.EN) {
    return path
  }
  return path === '/' ? ZH_PREFIX : `${ZH_PREFIX}${path}`
}

/** 去掉语言前缀得到基准路径：'/zh/legal' → '/legal'；'/zh' → '/'；前缀须整段匹配（'/zhang' 原样返回） */
export function stripLocale(path: string): string {
  if (path === ZH_PREFIX || path === `${ZH_PREFIX}/`) {
    return '/'
  }
  if (path.startsWith(`${ZH_PREFIX}/`)) {
    return path.slice(ZH_PREFIX.length)
  }
  return path
}

/** 计算当前页在目标语言下的对等地址（保留锚点）；path 为带或不带 /zh 前缀的路由 path */
export function localeSwitchTarget(path: string, hash: string, target: Locale): string {
  return localizePath(stripLocale(path), target) + hash
}
