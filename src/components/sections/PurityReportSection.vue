<script setup lang="ts">
// 模型纯度报告区块：展示最新一期独立审计数据。
// 数据为静态快照，随每期报告手工更新；通过率由 passed/TOTAL_REPORTS 计算，避免文案与数据漂移。
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const VERIDROP_URL = 'https://veridrop.org'
const TOTAL_REPORTS = 26

// 八项关键检查：name 为报告里的检查项标识（代码风格展示，不参与 i18n）
const KEY_CHECKS = [
  { name: 'token_usage', passed: 26 },
  { name: 'consistency', passed: 26 },
  { name: 'thinking_signature', passed: 26 },
  { name: 'protocol', passed: 26 },
  { name: 'message_id', passed: 26 },
  { name: 'integrity', passed: 25 },
  { name: 'behavioral_signature', passed: 25 },
  { name: 'identity', passed: 25 },
]

function passRate(passed: number): string {
  return `${((passed / TOTAL_REPORTS) * 100).toFixed(1)}%`
}
</script>

<template>
  <section id="purity" class="purity">
    <div class="wrap">
      <header class="head">
        <div class="head-main">
          <span class="report-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3l8 4v5c0 4.4-3.1 7.6-8 9-4.9-1.4-8-4.6-8-9V7l8-4z" />
            </svg>
            {{ t('purity.badge') }}
          </span>
          <!-- :key="locale"：与 HeroSection 同理，切语言整体重挂载，防强调色丢失 -->
          <i18n-t :key="locale" keypath="purity.title" tag="h2" class="title">
            <template #em>
              <span class="em">{{ t('purity.titleEm') }}</span>
            </template>
          </i18n-t>
          <p class="intro">{{ t('purity.intro') }}</p>
        </div>

        <div class="head-meta">
          <i18n-t :key="locale" keypath="purity.basedOn" tag="p" class="based-on">
            <template #n>
              <strong>{{ TOTAL_REPORTS }}</strong>
            </template>
          </i18n-t>
          <div class="verify-row">
            <span class="proto-label">{{ t('purity.protocolLabel') }}</span>
            <span class="chip chip-proto">anthropic</span>
            <a class="chip chip-verified" :href="VERIDROP_URL" target="_blank" rel="noopener">
              <svg
                width="14"
                height="14"
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
              {{ t('purity.verifiedBy') }}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div class="stats">
        <article class="stat stat-hero">
          <p class="stat-value stat-accent">A+</p>
          <p class="stat-label">{{ t('purity.trustLabel') }}</p>
        </article>
        <article class="stat">
          <p class="stat-value">99<span class="stat-sub">/ 100</span></p>
          <p class="stat-label">{{ t('purity.purityLabel') }}</p>
        </article>
        <article class="stat">
          <p class="stat-value">100<span class="stat-pct">%</span></p>
          <p class="stat-label">
            <span class="pass-chip">{{ t('purity.passed') }}</span>
            {{ t('purity.consistencyLabel') }}
          </p>
        </article>
        <article class="stat">
          <p class="stat-value">
            0<span class="stat-sub">/ {{ TOTAL_REPORTS }}</span>
          </p>
          <p class="stat-label">{{ t('purity.criticalLabel') }}</p>
        </article>
      </div>

      <div class="crypto">
        <div class="crypto-icon" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3l8 4v5c0 4.4-3.1 7.6-8 9-4.9-1.4-8-4.6-8-9V7l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div class="crypto-body">
          <h3 class="crypto-title">{{ t('purity.cryptoTitle') }}</h3>
          <p class="crypto-desc">{{ t('purity.cryptoDesc') }}</p>
        </div>
        <div class="crypto-score">
          <span class="crypto-pct">{{ passRate(TOTAL_REPORTS) }}</span>
          <span class="crypto-tests">{{ t('purity.liveTests', { n: TOTAL_REPORTS }) }}</span>
        </div>
      </div>

      <div class="checks">
        <p class="checks-head">
          <strong>{{ t('purity.checksTitle', { count: KEY_CHECKS.length }) }}</strong>
          {{ t('purity.checksSubtitle', { n: TOTAL_REPORTS }) }}
        </p>
        <div class="checks-grid">
          <article v-for="check in KEY_CHECKS" :key="check.name" class="check">
            <div class="check-top">
              <code class="check-name">{{ check.name }}</code>
              <span
                class="check-rate"
                :class="{ 'check-rate-full': check.passed === TOTAL_REPORTS }"
              >
                {{ passRate(check.passed) }}
              </span>
            </div>
            <div class="bar">
              <span
                class="bar-fill"
                :style="{ width: `${(check.passed / TOTAL_REPORTS) * 100}%` }"
              />
            </div>
            <p class="check-count">{{ check.passed }} / {{ TOTAL_REPORTS }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.purity {
  padding: 56px 44px 120px;
}

.wrap {
  max-width: 1140px;
  margin: 0 auto;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

/* 标题容器放宽到一行能容下中文标题（13 个全角字 × 52px ≈ 680px），简介单独限宽 */
.head-main {
  max-width: 700px;
}

.report-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  font: 700 12px var(--font-sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.title {
  margin: 20px 0 0;
  font: 500 52px var(--font-serif);
  letter-spacing: -0.015em;
  line-height: 1.08;
  color: var(--text);
}

.em {
  font-style: italic;
  color: var(--accent);
}

.intro {
  max-width: 620px;
  margin: 18px 0 0;
  font: 400 17px var(--font-sans);
  line-height: 1.62;
  color: var(--text2);
}

.head-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.based-on {
  margin: 0;
  font: 400 14px var(--font-sans);
  color: var(--text2);
}

.based-on strong {
  color: var(--text);
}

.verify-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.proto-label {
  font: 400 14px var(--font-sans);
  color: var(--text2);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  font: 600 13px var(--font-sans);
}

.chip-proto {
  padding: 6px 13px;
  background: var(--muted);
  color: var(--text2);
}

.chip-verified {
  padding: 7px 14px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  color: var(--accent-deep);
  transition: border-color 0.18s ease;
}

.chip-verified:hover {
  border-color: var(--accent);
}

.stats {
  margin-top: 44px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px 26px 24px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.045);
}

.stat-hero {
  border-color: var(--accent);
  box-shadow: 0 2px 16px rgba(23, 209, 167, 0.14);
}

.stat-value {
  margin: 0;
  font: 700 42px var(--font-sans);
  letter-spacing: -0.01em;
  color: var(--text);
}

.stat-accent {
  color: var(--accent);
}

.stat-sub {
  margin-left: 8px;
  font: 500 20px var(--font-sans);
  color: var(--ph);
}

.stat-pct {
  font-size: 26px;
  vertical-align: 8px;
}

.stat-label {
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font: 400 14px var(--font-sans);
  color: var(--text2);
}

.pass-chip {
  font: 700 11px var(--font-sans);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--accent-soft2);
  color: var(--accent-deep);
}

.crypto {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border: 1px solid var(--accent-border);
  border-radius: 18px;
  background: var(--accent-soft);
}

.crypto-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.crypto-body {
  flex: 1;
}

.crypto-title {
  margin: 0;
  font: 700 18px var(--font-sans);
  color: var(--text);
}

.crypto-desc {
  margin: 6px 0 0;
  font: 400 14.5px var(--font-sans);
  line-height: 1.55;
  color: var(--text2);
}

.crypto-score {
  text-align: right;
  flex-shrink: 0;
}

.crypto-pct {
  display: block;
  font: 700 32px var(--font-sans);
  letter-spacing: -0.01em;
  color: var(--accent-deep);
}

.crypto-tests {
  display: block;
  margin-top: 2px;
  font: 400 13px var(--font-sans);
  color: var(--text2);
}

.checks {
  margin-top: 18px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 26px 30px 30px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.045);
}

.checks-head {
  margin: 0 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  font: 400 14px var(--font-sans);
  color: var(--text2);
}

.checks-head strong {
  font-size: 15px;
  color: var(--text);
}

.checks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.check {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 16px 14px;
}

.check-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.check-name {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--muted);
  color: var(--text2);
  font:
    500 12px ui-monospace,
    'SF Mono',
    Menlo,
    Consolas,
    monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-rate {
  font: 700 15px var(--font-sans);
  color: var(--text);
}

.check-rate-full {
  color: var(--accent-deep);
}

.bar {
  margin-top: 14px;
  height: 4px;
  border-radius: 999px;
  background: var(--muted);
  overflow: hidden;
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
}

.check-count {
  margin: 10px 0 0;
  font: 400 12.5px var(--font-sans);
  color: var(--ph);
}

@media (max-width: 1080px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
  }

  .head-meta {
    align-items: flex-start;
  }

  .stats,
  .checks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .purity {
    padding: 32px 18px 80px;
  }

  .title {
    font-size: 36px;
  }

  .stats,
  .checks-grid {
    grid-template-columns: 1fr;
  }

  .crypto {
    flex-wrap: wrap;
  }

  .crypto-score {
    text-align: left;
  }
}
</style>
