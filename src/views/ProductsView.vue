<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { API_URL, SHOP_URL } from '@/config/site'

// 产品页：结构化数组驱动产品大卡（词条在 products 命名空间），
// 后续新增产品＝加一段词条＋一个数组项
useSeo('PRODUCTS')
const { t } = useI18n()

// key 对应词条命名空间 products.<key>，href 为 CTA 外链目标
const PRODUCTS = [
  { key: 'api', href: API_URL },
  { key: 'shop', href: SHOP_URL },
] as const

// 每个产品固定三条能力要点，模板按序号取词条
const POINT_COUNT = 3
</script>

<template>
  <AppHeader />
  <main class="products">
    <div class="inner">
      <h1 class="title">{{ t('products.title') }}</h1>
      <p class="intro">{{ t('products.intro') }}</p>

      <div class="list">
        <article v-for="p in PRODUCTS" :key="p.key" class="product-card">
          <div class="body">
            <div class="head">
              <h2 class="name">{{ t(`products.${p.key}.name`) }}</h2>
              <span class="badge badge-live">{{ t('products.live') }}</span>
            </div>
            <p class="tagline">{{ t(`products.${p.key}.tagline`) }}</p>
            <ul class="points">
              <li v-for="n in POINT_COUNT" :key="n" class="point">
                {{ t(`products.${p.key}.point${n}`) }}
              </li>
            </ul>
            <a :href="p.href" target="_blank" rel="noopener" class="cta">
              {{ t(`products.${p.key}.cta`) }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <!-- 装饰图形：薄荷 halftone 网点，延续 Hero/联系页的波普点阵母题 -->
          <div class="art" aria-hidden="true" />
        </article>

        <article class="product-card product-card--soon">
          <div class="body">
            <div class="head">
              <h2 class="name name--muted">{{ t('products.more.name') }}</h2>
              <span class="badge badge-soon">{{ t('products.soon') }}</span>
            </div>
            <p class="tagline">{{ t('products.more.desc') }}</p>
          </div>
        </article>
      </div>
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

.list {
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* 产品大卡：左文右图两栏；SOON 卡复用主页 More 卡的虚线视觉 */
.product-card {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 44px 40px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.045);
}

.product-card--soon {
  grid-template-columns: 1fr;
  background: var(--cream);
  border: 1px dashed var(--border2);
  box-shadow: none;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.name {
  margin: 0;
  font: 500 32px var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--text);
}

.name--muted {
  color: var(--text2);
}

.badge {
  font: 600 11px var(--font-sans);
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge-live {
  color: var(--accent);
  background: var(--accent-soft);
}

.badge-soon {
  color: var(--ph);
  background: var(--muted);
}

.tagline {
  margin: 14px 0 0;
  max-width: 560px;
  font: 400 17px var(--font-sans);
  line-height: 1.6;
  color: var(--text2);
}

.points {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.point {
  position: relative;
  padding-left: 22px;
  font: 400 15px var(--font-sans);
  line-height: 1.55;
  color: var(--text2);
}

.point::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.52em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}

.cta {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 600 14px var(--font-sans);
  color: var(--accent);
  padding: 10px 20px;
  border-radius: 11px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  transition: background-color 0.18s ease;
}

.cta:hover {
  background: var(--accent-soft2);
}

/* 薄荷网点装饰：与联系页 wechat-dots 同款 halftone 手法，纯 CSS 无外部资源 */
.art {
  border-radius: 14px;
  background: linear-gradient(150deg, var(--accent-deep) 0%, var(--accent) 45%, transparent 92%);
  -webkit-mask-image: radial-gradient(#000 2px, transparent 2.2px);
  mask-image: radial-gradient(#000 2px, transparent 2.2px);
  -webkit-mask-size: 18px 18px;
  mask-size: 18px 18px;
  opacity: 0.16;
}

@media (max-width: 920px) {
  .product-card {
    grid-template-columns: 1fr;
  }

  .art {
    display: none;
  }
}

@media (max-width: 720px) {
  .products {
    padding: 72px 18px 80px;
  }

  .title {
    font-size: 40px;
  }

  .product-card {
    padding: 32px 24px;
  }

  .name {
    font-size: 26px;
  }
}
</style>
