<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import ApiMock from '@/components/products/ApiMock.vue'
import LaneMock from '@/components/products/LaneMock.vue'
import ShopMock from '@/components/products/ShopMock.vue'
import { useSeo } from '@/composables/useSeo'
import { API_URL, SHOP_URL } from '@/config/site'

// 产品页：顶部 featured 轮播（每产品一张 slide：示意图 + 文案 + CTA）+ 下方全部产品宫格。
// 结构化数组驱动，词条在 products.<key> 命名空间；新增产品＝加一段词条＋一个数组项＋一张示意图。
useSeo('PRODUCTS')
const { t } = useI18n()

// key 对应词条命名空间与 public/products/<key>.png 图标；href 为 CTA 外链目标。
// Lane 尚未上线，落地地址等真正发布时再补，先指向 '#'。
const PRODUCTS = [
  { key: 'api', href: API_URL, mock: ApiMock },
  { key: 'shop', href: SHOP_URL, mock: ShopMock },
  { key: 'lane', href: '#', mock: LaneMock },
] as const

// 每个产品固定三条能力要点，模板按序号取词条
const POINT_COUNT = 3

// 轮播：单个整数索引，前后均循环；无自动播放，计数器代替分页点
const index = ref(0)
const count = PRODUCTS.length
const go = (d: number) => {
  index.value = (index.value + d + count) % count
}
const trackStyle = computed(() => ({ transform: `translateX(${-index.value * 100}%)` }))
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === 'ArrowRight') go(1)
}
</script>

<template>
  <AppHeader />
  <main class="products">
    <div class="inner">
      <section
        class="featured"
        :aria-label="t('products.featured')"
        tabindex="0"
        @keydown="onKeydown"
      >
        <div class="featured-dots" aria-hidden="true" />
        <div class="viewport">
          <div class="track" :style="trackStyle">
            <div
              v-for="(p, i) in PRODUCTS"
              :key="p.key"
              class="slide"
              :aria-hidden="i !== index"
              :inert="i !== index"
            >
              <div class="slide-grid">
                <component :is="p.mock" />
                <div class="copy">
                  <img :src="`/products/${p.key}.png`" alt="" width="64" height="64" class="icon" />
                  <h2 class="slide-title">{{ t(`products.${p.key}.name`) }}</h2>
                  <p class="slide-tagline">{{ t(`products.${p.key}.featured`) }}</p>
                  <a :href="p.href" target="_blank" rel="noopener" class="btn btn--lg">
                    {{ t(`products.${p.key}.cta`) }}
                    <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="controls">
          <button type="button" class="ctrl" :aria-label="t('products.prev')" @click="go(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span class="counter" aria-live="polite">{{ index + 1 }} / {{ count }}</span>
          <button type="button" class="ctrl" :aria-label="t('products.next')" @click="go(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </section>

      <div class="head">
        <h1 class="title">{{ t('products.title') }}</h1>
        <span class="meta">{{ t('products.meta') }}</span>
      </div>

      <div class="grid">
        <article v-for="p in PRODUCTS" :key="p.key" class="product-card">
          <!-- 产品图标水印：右上角溢出，深色模式透明度由 token 降低 -->
          <img :src="`/products/${p.key}.png`" alt="" class="watermark" aria-hidden="true" />
          <div class="body">
            <span class="badge badge-live">{{ t('products.live') }}</span>
            <h3 class="name">{{ t(`products.${p.key}.name`) }}</h3>
            <!-- 荧光笔高亮关键短语：hl 词条单独成键，便于双语各自选高亮范围 -->
            <i18n-t :keypath="`products.${p.key}.tagline`" tag="p" class="tagline">
              <template #hl>
                <span class="hl">{{ t(`products.${p.key}.hl`) }}</span>
              </template>
            </i18n-t>
            <ul class="points">
              <li v-for="n in POINT_COUNT" :key="n">{{ t(`products.${p.key}.point${n}`) }}</li>
            </ul>
            <a :href="p.href" target="_blank" rel="noopener" class="btn cta">
              {{ t(`products.${p.key}.cta`) }}
              <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </article>

        <article class="product-card product-card--soon">
          <span class="badge badge-soon">{{ t('products.soon') }}</span>
          <h3 class="name name--muted">{{ t('products.more.name') }}</h3>
          <p class="tagline tagline--muted">{{ t('products.more.desc') }}</p>
        </article>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.products {
  background: var(--surface-page);
  padding: 40px 28px 120px;
  min-height: calc(100vh - 74px);
}

.inner {
  max-width: 1180px;
  margin: 0 auto;
}

/* ---- Featured 轮播 ---- */
.featured {
  position: relative;
  margin-bottom: 72px;
  border: var(--border-width) solid var(--border-accent);
  border-radius: 24px;
  overflow: hidden;
  background: var(--surface-featured);
}

.featured:focus-visible {
  outline-offset: 0;
}

/* 薄荷网点纹理，集中在左上角渐隐 */
.featured-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(23, 209, 167, 0.3) 1.6px, transparent 1.6px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(120% 90% at 15% 0%, rgba(0, 0, 0, 0.9), transparent 70%);
  mask-image: radial-gradient(120% 90% at 15% 0%, rgba(0, 0, 0, 0.9), transparent 70%);
  pointer-events: none;
}

.viewport {
  overflow: hidden;
}

.track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* 底部多留空给右下角的翻页控件 */
.slide {
  flex: 0 0 100%;
  padding: 52px 56px 84px;
}

.slide-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 44px;
  align-items: center;
}

.copy {
  min-height: 348px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 18px;
}

.slide-title {
  margin: 0 0 12px;
  font: 500 44px var(--font-serif);
  line-height: 1.02;
  letter-spacing: -0.015em;
  color: var(--text);
}

/* min-height 锁住各 slide 的 CTA 基线 */
.slide-tagline {
  margin: 0 0 26px;
  max-width: 30ch;
  min-height: 84px;
  font-size: 19px;
  line-height: 1.45;
  color: var(--featured-text);
}

/* 实心 mint 按钮：ink 文字为品牌规定，深色模式也不翻转 */
.btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 22px;
  border-radius: 6px;
  background: var(--accent);
  color: #0b0b0c;
  font: 600 15px var(--font-sans);
  line-height: 1;
  transition: background-color 0.18s ease-out;
}

.btn:hover {
  background: var(--accent-bright);
}

.btn--lg {
  height: 48px;
  padding: 0 26px;
  font-size: 16px;
}

.arrow {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn--lg .arrow {
  width: 18px;
  height: 18px;
}

.controls {
  position: absolute;
  right: 26px;
  bottom: 22px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--featured-ink);
}

.ctrl {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.18s ease-out;
}

.ctrl:hover {
  background: rgba(255, 255, 255, 0.7);
}

:root[data-theme='DARK'] .ctrl:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ctrl svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.counter {
  min-width: 46px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ---- 全部产品宫格 ---- */
.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.title {
  margin: 0;
  font: 500 44px var(--font-serif);
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--text);
}

.meta {
  font-size: 15px;
  color: var(--text2);
}

/* 1180px 容器下 2×2；min() 兜底防窄屏溢出 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
  gap: 22px;
}

.product-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: var(--border-width) solid var(--border-default);
  border-radius: 14px;
  padding: 28px 30px 30px;
  box-shadow: var(--card-shadow);
  transition:
    transform 0.18s ease-out,
    border-color 0.18s ease-out;
}

.product-card:not(.product-card--soon):hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.product-card--soon {
  justify-content: center;
  padding: 28px 30px;
  background: var(--surface-soon);
  box-shadow: none;
}

.watermark {
  position: absolute;
  top: -56px;
  right: -58px;
  width: 260px;
  height: 260px;
  object-fit: contain;
  opacity: var(--watermark-opacity);
  pointer-events: none;
}

.body {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font: 600 12px var(--font-sans);
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.badge-live {
  background: var(--accent);
  color: #0b0b0c;
}

.badge-soon {
  background: var(--muted);
  color: var(--ph);
}

.name {
  margin: 14px 0 10px;
  font: 500 34px var(--font-serif);
  line-height: 1;
  letter-spacing: -0.015em;
  color: var(--text);
  white-space: nowrap;
}

.name--muted {
  color: var(--ph);
}

.tagline {
  margin: 0 0 20px;
  font-size: 18px;
  line-height: 1.4;
  color: var(--card-text);
}

.tagline--muted {
  margin: 0;
  color: var(--ph);
}

/* 荧光笔式下划高亮 */
.hl {
  background: linear-gradient(transparent 58%, var(--highlight) 58%);
}

.points {
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 14px;
  color: var(--text2);
}

/* margin-top:auto：宫格内卡片等高时 CTA 底部对齐 */
.cta {
  margin-top: auto;
}

@media (prefers-reduced-motion: reduce) {
  .track,
  .btn,
  .ctrl,
  .product-card {
    transition: none;
  }
}

/* 移动端：设计稿未定义，按现有页面规则折叠——轮播改单列、示意图上、文案下，标题降级 */
@media (max-width: 920px) {
  .slide {
    padding: 28px 24px 76px;
  }

  .slide-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .copy {
    min-height: 0;
  }

  .slide-tagline {
    min-height: 0;
  }
}

@media (max-width: 720px) {
  .products {
    padding: 24px 18px 80px;
  }

  .featured {
    margin-bottom: 48px;
    border-radius: 18px;
  }

  .slide-title,
  .title {
    font-size: 34px;
  }

  .head {
    flex-direction: column;
    gap: 6px;
  }

  .product-card {
    padding: 24px;
  }

  .name {
    font-size: 28px;
    white-space: normal;
  }
}
</style>
