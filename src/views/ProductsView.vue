<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'

// 产品页：路由/SEO 先行注册，产品卡列表在后续提交填充
useSeo('PRODUCTS')
const { t } = useI18n()
</script>

<template>
  <AppHeader />
  <main class="products">
    <div class="inner">
      <h1 class="title">{{ t('products.title') }}</h1>
      <p class="intro">{{ t('products.intro') }}</p>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
/* 页首排版与联系页同构：左对齐编辑式大标题 + 短 intro */
.products {
  background: var(--bg);
  padding: 96px 44px 120px;
  min-height: calc(100vh - 74px);
}

.inner {
  max-width: 1140px;
  margin: 0 auto;
}

.title {
  margin: 0;
  font: 500 64px var(--font-serif);
  letter-spacing: -0.015em;
  color: var(--text);
}

.intro {
  margin: 26px 0 0;
  max-width: 560px;
  font: 400 18px var(--font-sans);
  line-height: 1.65;
  color: var(--text2);
}

@media (max-width: 720px) {
  .products {
    padding: 72px 18px 80px;
  }

  .title {
    font-size: 40px;
  }
}
</style>
