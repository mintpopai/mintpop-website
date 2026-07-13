<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import GuaranteesSection from '@/components/sections/GuaranteesSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ModalitiesSection from '@/components/sections/ModalitiesSection.vue'
import PurityReportSection from '@/components/sections/PurityReportSection.vue'
import { useSeo } from '@/composables/useSeo'
import { Locale } from '@/config/locale'
import { SEO } from '@/config/seo'
import { BRAND_ICON_URL, SITE_NAME, SITE_URL } from '@/config/site'

useSeo('HOME')

// 与 useSeo 同理:中英首页共用同一个组件实例,跨语言导航不重跑 setup,
// locale/jsonLd 必须是 computed,否则结构化数据的 description 会停留在旧语言。
const route = useRoute()
const locale = computed(() => route.meta.locale ?? Locale.EN)

// 结构化数据:品牌(Organization)+ 站点(WebSite),description 跟随页面语言
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: BRAND_ICON_URL,
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SEO.HOME.copy[locale.value].description,
    },
  ],
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(jsonLd.value)),
    },
  ],
})
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <GuaranteesSection />
    <PurityReportSection />
    <ModalitiesSection />
  </main>
  <AppFooter />
</template>
