<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { SUPPORT_EMAIL, TELEGRAM_GROUP_URL } from '@/config/site'

// 联系页：邮件支持 + Telegram 群两个渠道（个人账号已按需求移除，见组件测试守护）
useSeo('CONTACT')
const { t } = useI18n()
</script>

<template>
  <AppHeader />
  <main class="contact">
    <div class="inner">
      <h1 class="title">{{ t('contact.title') }}</h1>
      <p class="intro">{{ t('contact.intro') }}</p>

      <div class="cards">
        <article class="card card--email">
          <span class="icon icon--email" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <p class="label label--accent">{{ t('contact.emailLabel') }}</p>
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="email">{{ SUPPORT_EMAIL }}</a>
          <p class="desc">{{ t('contact.emailDesc') }}</p>
        </article>

        <article class="card card--telegram">
          <span class="icon icon--telegram" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </span>
          <p class="label">{{ t('contact.telegramLabel') }}</p>
          <a :href="TELEGRAM_GROUP_URL" target="_blank" rel="noopener" class="tg-link">
            {{ t('contact.telegramJoin') }}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.contact {
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

.cards {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.card {
  border-radius: 20px;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.card--email {
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
}

.card--telegram {
  background: var(--card);
  border: 1px solid var(--border);
}

.icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.icon--email {
  background: var(--accent-soft2);
  color: var(--accent);
}

/* Telegram 品牌蓝：局部固定色，不随主题变量走 */
.icon--telegram {
  color: #2aabee;
}

.label {
  margin: 0;
  font: 600 12px var(--font-sans);
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text2);
}

.label--accent {
  color: var(--accent);
}

.email {
  font: 500 26px var(--font-serif);
  color: var(--text);
  transition: color 0.18s ease;
}

.email:hover {
  color: var(--accent);
}

.desc {
  margin: 0;
  font: 400 15px var(--font-sans);
  line-height: 1.6;
  color: var(--text2);
}

.tg-link {
  font: 600 17px var(--font-sans);
  color: #2aabee;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.tg-link:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .contact {
    padding: 64px 24px 88px;
  }

  .title {
    font-size: 44px;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
