<script setup lang="ts">
// 三项承诺区块：原生模型 / 数据私密 / 真人应答。
// 设计上整块固定深色（两种主题下观感一致），故面板配色不走主题变量。
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
</script>

<template>
  <section id="guarantees" class="guarantees">
    <div class="wrap">
      <div class="panel">
        <!-- 装饰层：右上角品牌色网点（纯展示，不可交互） -->
        <div class="deco-dots" aria-hidden="true" />

        <p class="eyebrow">{{ t('guarantees.eyebrow') }}</p>
        <!-- :key="locale"：与 HeroSection 同理，中英文子节点结构不保证一致，切语言整体重挂载 -->
        <i18n-t :key="locale" keypath="guarantees.title" tag="h2" class="title">
          <template #em>
            <span class="em">{{ t('guarantees.titleEm') }}</span>
          </template>
        </i18n-t>

        <div class="grid">
          <article class="item">
            <svg
              class="item-icon"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <i18n-t :key="locale" keypath="guarantees.modelTitle" tag="h3" class="item-title">
              <template #em>
                <span class="em">{{ t('guarantees.modelEm') }}</span>
              </template>
            </i18n-t>
            <p class="item-desc">{{ t('guarantees.modelDesc') }}</p>
            <span class="pill">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3l8 4v5c0 4.4-3.1 7.6-8 9-4.9-1.4-8-4.6-8-9V7l8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              {{ t('guarantees.modelBadge') }}
            </span>
          </article>

          <article class="item">
            <svg
              class="item-icon"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <i18n-t :key="locale" keypath="guarantees.privacyTitle" tag="h3" class="item-title">
              <template #em>
                <span class="em">{{ t('guarantees.privacyEm') }}</span>
              </template>
            </i18n-t>
            <p class="item-desc">{{ t('guarantees.privacyDesc') }}</p>
            <span class="pill">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              {{ t('guarantees.privacyBadge') }}
            </span>
          </article>

          <article class="item">
            <svg
              class="item-icon"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 18v-6a8 8 0 0 1 16 0v6" />
              <path d="M4 19a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H4v5z" />
              <path d="M20 19a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h3v5z" />
            </svg>
            <i18n-t :key="locale" keypath="guarantees.humanTitle" tag="h3" class="item-title">
              <template #em>
                <span class="em">{{ t('guarantees.humanEm') }}</span>
              </template>
            </i18n-t>
            <p class="item-desc">{{ t('guarantees.humanDesc') }}</p>
            <span class="pill">
              <span class="online-dot" aria-hidden="true" />
              {{ t('guarantees.humanBadge') }}
            </span>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.guarantees {
  padding: 24px 44px 40px;
}

.wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.panel {
  position: relative;
  overflow: hidden;
  background: #121614;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 28px;
  padding: 64px 72px 72px;
}

.deco-dots {
  position: absolute;
  right: -40px;
  top: -20px;
  width: 380px;
  height: 300px;
  background: radial-gradient(var(--accent) 1.6px, transparent 1.9px);
  background-size: 16px 16px;
  opacity: 0.2;
  -webkit-mask-image: linear-gradient(215deg, #000 10%, transparent 72%);
  mask-image: linear-gradient(215deg, #000 10%, transparent 72%);
  pointer-events: none;
}

.eyebrow {
  margin: 0;
  font: 700 12px var(--font-sans);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
}

.title {
  margin: 16px 0 0;
  font: 500 52px var(--font-serif);
  letter-spacing: -0.015em;
  line-height: 1.1;
  color: #f4f7f5;
}

.em {
  font-style: italic;
  color: var(--accent);
}

.grid {
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* subgrid：图标/标题/描述/徽标四行跨三栏共享行高，
   标题折行数不同时，描述与徽标仍逐行对齐（标题行统一取最高栏的高度） */
.item {
  grid-row: span 4;
  display: grid;
  grid-template-rows: subgrid;
  justify-items: start;
  padding: 0 36px;
}

.item:first-child {
  padding-left: 0;
}

.item:last-child {
  padding-right: 0;
}

.item + .item {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.item-icon {
  display: block;
}

.item-title {
  margin: 22px 0 0;
  font: 500 27px var(--font-serif);
  line-height: 1.28;
  color: #f4f7f5;
}

.item-desc {
  margin: 14px 0 0;
  font: 400 15px var(--font-sans);
  line-height: 1.62;
  color: #a6b1ac;
}

.pill {
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid rgba(23, 209, 167, 0.38);
  background: rgba(23, 209, 167, 0.08);
  font: 600 13px var(--font-sans);
  color: var(--accent);
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(23, 209, 167, 0.22);
}

@media (max-width: 920px) {
  .panel {
    padding: 48px 32px 52px;
  }

  .title {
    font-size: 38px;
  }

  .grid {
    grid-template-columns: 1fr;
    margin-top: 36px;
  }

  .item {
    padding: 28px 0;
  }

  .item:first-child {
    padding-top: 0;
  }

  .item:last-child {
    padding-bottom: 0;
  }

  .item + .item {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 720px) {
  .guarantees {
    padding: 16px 18px 28px;
  }
}
</style>
