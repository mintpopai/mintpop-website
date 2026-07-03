<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import CapabilitiesSection from '@/components/sections/CapabilitiesSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ModalitiesSection from '@/components/sections/ModalitiesSection.vue'
import { useSeo } from '@/composables/useSeo'
import { Locale } from '@/config/locale'
import { SEO } from '@/config/seo'
import { absoluteUrl, BRAND_LOGO_PATH, SITE_NAME, SITE_URL } from '@/config/site'

useSeo('HOME')

const locale = useRoute().meta.locale ?? Locale.EN

// 结构化数据:品牌(Organization)+ 站点(WebSite),description 跟随页面语言
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl(BRAND_LOGO_PATH),
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SEO.HOME.copy[locale].description,
    },
  ],
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    },
  ],
})
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <CapabilitiesSection />
    <ModalitiesSection />
  </main>
  <AppFooter />
</template>
