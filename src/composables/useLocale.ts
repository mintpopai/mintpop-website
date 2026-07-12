import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Locale, LOCALE_LABELS, localeSwitchTarget, localizePath } from '@/config/locale'
import { safeStorageGet, safeStorageSet } from '@/utils/safeStorage'

// 语言偏好持久化键：手动切换时写入；回访时 App.vue 用它把用户带回偏好语言
export const STORAGE_KEY_LOCALE = 'mintpop-locale'

/** 记住用户手动选择的语言（SSG 构建期/存储不可用时由 safeStorage 静默跳过） */
export function rememberLocale(locale: Locale): void {
  safeStorageSet(STORAGE_KEY_LOCALE, locale)
}

/** 读取语言偏好；无记录、值非法（历史脏数据）或存储不可用时返回 null */
export function readLocalePreference(): Locale | null {
  const saved = safeStorageGet(STORAGE_KEY_LOCALE)
  return saved === Locale.EN || saved === Locale.ZH ? saved : null
}

/**
 * 语言上下文 composable：语言唯一由当前路由 meta.locale 决定。
 * lp() 把站内基准路径本地化到当前语言（页内链接用）；
 * switchTarget 是当前页在另一语言下的对等路径（切换器用，保留锚点）。
 */
export function useLocale() {
  const route = useRoute()
  const locale = computed<Locale>(() => route.meta.locale ?? Locale.EN)
  const otherLocale = computed<Locale>(() => (locale.value === Locale.ZH ? Locale.EN : Locale.ZH))
  const otherLabel = computed(() => LOCALE_LABELS[otherLocale.value])
  const lp = (path: string): string => localizePath(path, locale.value)
  const switchTarget = computed(() =>
    localeSwitchTarget(route.path, route.query, route.hash, otherLocale.value),
  )
  return { locale, otherLocale, otherLabel, lp, switchTarget }
}
