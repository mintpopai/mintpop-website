<script setup lang="ts">
// 三张能力卡片：图标 + 标题 + 描述。
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="capabilities" class="capabilities">
    <!-- 本区块设计上无可见标题，补隐藏 h2 保持 h1→h2→h3 层级不跳级 -->
    <h2 class="visually-hidden">{{ t('capabilities.heading') }}</h2>
    <div class="wrap">
      <div class="grid">
        <article class="card">
          <div class="icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="8" cy="15" r="4" />
              <path d="M10.8 12.2L19 4M16 7l3 3M14 9l2 2" />
            </svg>
          </div>
          <h3 class="card-title">{{ t('capabilities.accessTitle') }}</h3>
          <p class="card-desc">
            {{ t('capabilities.accessDesc') }}
          </p>
        </article>

        <article class="card">
          <div class="icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v4h-4" />
            </svg>
          </div>
          <h3 class="card-title">{{ t('capabilities.reliableTitle') }}</h3>
          <p class="card-desc">
            {{ t('capabilities.reliableDesc') }}
          </p>
        </article>

        <article class="card">
          <div class="icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v10l7 3" />
            </svg>
          </div>
          <h3 class="card-title">{{ t('capabilities.billingTitle') }}</h3>
          <p class="card-desc">
            {{ t('capabilities.billingDesc') }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.capabilities {
  padding: 40px 44px 96px;
}

.wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 34px 30px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.045);
}

.icon {
  width: 54px;
  height: 54px;
  border-radius: 15px;
  background: var(--accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}

.card-title {
  margin: 0 0 12px;
  font:
    600 22px 'Space Grotesk',
    sans-serif;
  color: var(--text);
}

.card-desc {
  margin: 0;
  font:
    400 16px 'Space Grotesk',
    sans-serif;
  line-height: 1.62;
  color: var(--text2);
}

@media (max-width: 920px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .capabilities {
    padding: 24px 18px 64px;
  }
}
</style>
