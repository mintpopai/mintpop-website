import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'

import { Locale, localizePath } from '@/config/locale'
import { SEO, type SeoRouteKey } from '@/config/seo'
import { absoluteUrl, OG_IMAGE_PATH, SITE_NAME } from '@/config/site'

// OG 图标准社交预览尺寸
const OG_IMAGE_WIDTH = '1200'
const OG_IMAGE_HEIGHT = '630'

// <html lang> 与 og:locale 的语言映射
const HTML_LANG: Record<Locale, string> = {
  [Locale.EN]: 'en',
  [Locale.ZH]: 'zh-CN',
}
const OG_LOCALE: Record<Locale, string> = {
  [Locale.EN]: 'en_US',
  [Locale.ZH]: 'zh_CN',
}

// unhead 的 ResolvableMeta/ResolvableLink 通过交叉 DataKeys 带有 `data-${string}` 索引签名;
// 具名接口若不显式声明同构索引签名,即便字段完全兼容,在跨函数返回值边界传入 useHead() 时
// 仍会被判定结构不兼容(TS 只对"新鲜"对象字面量隐式豁免索引签名,具名接口不享有该豁免)。
// 本站点不使用 data-* 自定义属性,此签名仅用于满足结构兼容,不改变实际取值。
type DataAttrs = Record<`data-${string}`, string | number | boolean>

interface SeoMeta extends DataAttrs {
  name?: string
  property?: string
  content: string
}

interface SeoLink extends DataAttrs {
  rel: string
  hreflang?: string
  href: string
}

export interface SeoHead {
  title: string
  htmlAttrs: { lang: string }
  meta: SeoMeta[]
  link: SeoLink[]
}

/**
 * 组装某路由某语言的完整 head 声明(纯函数,便于单测):
 * 本地化 title/描述/OG/Twitter + canonical + <html lang>;
 * 可收录页互挂 hreflang(en/zh/x-default,x-default 指英文),noindex 页输出 robots。
 */
export function buildSeoHead(key: SeoRouteKey, locale: Locale): SeoHead {
  const entry = SEO[key]
  const copy = entry.copy[locale]
  const canonical = absoluteUrl(localizePath(entry.path, locale))
  const ogImage = absoluteUrl(OG_IMAGE_PATH)

  const meta: SeoMeta[] = [
    { name: 'description', content: copy.description },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: OG_LOCALE[locale] },
    { property: 'og:title', content: copy.title },
    { property: 'og:description', content: copy.description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: OG_IMAGE_WIDTH },
    { property: 'og:image:height', content: OG_IMAGE_HEIGHT },
    { property: 'og:image:alt', content: copy.title },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: copy.title },
    { name: 'twitter:description', content: copy.description },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: copy.title },
  ]

  const link: SeoLink[] = [{ rel: 'canonical', href: canonical }]
  if (entry.noindex) {
    meta.push({ name: 'robots', content: 'noindex' })
  } else {
    // hreflang 互链让搜索引擎知晓两个语言版本互为对照
    link.push(
      { rel: 'alternate', hreflang: 'en', href: absoluteUrl(localizePath(entry.path, Locale.EN)) },
      { rel: 'alternate', hreflang: 'zh', href: absoluteUrl(localizePath(entry.path, Locale.ZH)) },
      { rel: 'alternate', hreflang: 'x-default', href: absoluteUrl(entry.path) },
    )
  }

  return {
    title: copy.title,
    htmlAttrs: { lang: HTML_LANG[locale] },
    meta,
    link,
  }
}

/**
 * 按路由 key 声明该页 head。语言从当前路由 meta.locale 读取(URL 唯一决定语言),
 * 各 View 调用方式不变:useSeo('HOME')。
 */
export function useSeo(key: SeoRouteKey): void {
  const route = useRoute()
  useHead(buildSeoHead(key, route.meta.locale ?? Locale.EN))
}
