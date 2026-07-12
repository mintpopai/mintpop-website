<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import wechatQrUrl from '@/assets/wechat-qr.jpg'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { SUPPORT_EMAIL, TELEGRAM_GROUP_URL } from '@/config/site'

// 联系页：邮件支持 + Telegram 群 + 微信二维码三个渠道（个人账号已按需求移除，见组件测试守护）
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
          <div class="tg-body">
            <p class="label">{{ t('contact.telegramLabel') }}</p>
            <a :href="TELEGRAM_GROUP_URL" target="_blank" rel="noopener" class="tg-link">
              {{ t('contact.telegramJoin') }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>

        <article class="card card--wechat">
          <!-- 网点纹理：与 Hero 的波普 halftone 同一母题——二维码本身就是点阵 -->
          <div class="wechat-dots" aria-hidden="true" />
          <div class="wechat-head">
            <span class="icon icon--wechat" aria-hidden="true">
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
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
            </span>
            <p class="label">{{ t('contact.wechatLabel') }}</p>
          </div>
          <img :src="wechatQrUrl" :alt="t('contact.wechatQrAlt')" class="wechat-qr" />
          <p class="desc desc--center">{{ t('contact.wechatDesc') }}</p>
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

/* 非对称网格：左列＝邮件主卡 + Telegram 横条（书面/正式渠道在上），
   右列整高留给微信二维码竖卡——布局本身编码「一个支持渠道 + 两个 IM 渠道」 */
.cards {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'email wechat'
    'telegram wechat';
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
  grid-area: email;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  /* 左列高度随右侧二维码卡拉伸，内容垂直居中避免下方大片留白 */
  justify-content: center;
}

.card--telegram {
  grid-area: telegram;
  background: var(--card);
  border: 1px solid var(--border);
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 28px 36px;
}

.tg-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

/* 横条版式里图标与文字块并排，去掉纵向卡片的图标下间距 */
.card--telegram .icon {
  margin-bottom: 0;
  flex-shrink: 0;
}

.card--wechat {
  grid-area: wechat;
  position: relative;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 18px;
}

/* 签名装饰：薄荷网点纹理，复用 Hero 的 halftone 手法（QR 码即点阵，同一视觉语言） */
.wechat-dots {
  position: absolute;
  right: -90px;
  top: -70px;
  width: 300px;
  height: 300px;
  background: linear-gradient(150deg, var(--accent-deep) 0%, var(--accent) 45%, transparent 92%);
  -webkit-mask-image: radial-gradient(#000 2px, transparent 2.2px);
  mask-image: radial-gradient(#000 2px, transparent 2.2px);
  -webkit-mask-size: 18px 18px;
  mask-size: 18px 18px;
  opacity: 0.16;
  pointer-events: none;
}

.wechat-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.wechat-head .icon {
  margin-bottom: 0;
}

/* 微信品牌绿：与 Telegram 同理，局部固定色 */
.icon--wechat {
  color: #07c160;
}

/* 二维码原图自带白底名片版式，深色主题下保持白底以保证可扫描 */
.wechat-qr {
  position: relative;
  width: 100%;
  max-width: 224px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.07);
}

.desc--center {
  text-align: center;
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
  font-weight: 500;
  font-size: clamp(26px, 2.8vw, 34px);
  font-family: var(--font-serif);
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
    grid-template-rows: none;
    grid-template-areas:
      'email'
      'telegram'
      'wechat';
  }

  .card--telegram {
    padding: 28px;
  }
}
</style>
