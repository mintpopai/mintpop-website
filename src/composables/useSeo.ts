import { useHead } from '@unhead/vue'

import { Locale } from '@/config/locale'
import { SEO, type SeoRouteKey } from '@/config/seo'
import { absoluteUrl, OG_IMAGE_PATH, SITE_NAME } from '@/config/site'

// OG 图标准社交预览尺寸
const OG_IMAGE_WIDTH = '1200'
const OG_IMAGE_HEIGHT = '630'

/**
 * 按路由 key 声明该页 head:基础 Meta + canonical + OG + Twitter 卡片。
 * noindex 页额外输出 robots=noindex。
 */
export function useSeo(key: SeoRouteKey): void {
  const entry = SEO[key]
  // 过渡：本任务先固定取英文文案，按语言取值在 useSeo 本地化任务中完成
  const copy = entry.copy[Locale.EN]
  const canonical = absoluteUrl(entry.path)
  const ogImage = absoluteUrl(OG_IMAGE_PATH)

  const meta = [
    { name: 'description', content: copy.description },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },
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
  if (entry.noindex) {
    meta.push({ name: 'robots', content: 'noindex' })
  }

  useHead({
    title: copy.title,
    meta,
    link: [{ rel: 'canonical', href: canonical }],
  })
}
