<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import qqQrUrl from '@/assets/qq-qr.jpg'
import wechatQrUrl from '@/assets/wechat-qr.jpg'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { QQ_GROUP_NUMBER, SUPPORT_EMAIL, TELEGRAM_GROUP_URL } from '@/config/site'

// 联系页：邮件支持 + Telegram 群 + IM 二维码（微信 / QQ 群可切换，默认微信）；
// 个人账号已按需求移除，见组件测试守护
useSeo('CONTACT')
const { t } = useI18n()

// IM 渠道取值按枚举命名规范用 SCREAMING_SNAKE_CASE
type ImChannel = 'WECHAT' | 'QQ'
const channel = ref<ImChannel>('WECHAT')
const isWechat = computed(() => channel.value === 'WECHAT')

// 群号点击复制：成功后短暂展示对勾反馈
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
async function copyGroupNumber() {
  try {
    await navigator.clipboard.writeText(QQ_GROUP_NUMBER)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}
onBeforeUnmount(() => clearTimeout(copiedTimer))
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
            <span class="icon icon--wechat" :class="{ 'icon--qq': !isWechat }" aria-hidden="true">
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
            <div class="im-toggle" role="group" :aria-label="t('contact.imToggleAria')">
              <span
                class="im-thumb"
                :class="{ 'im-thumb--qq': !isWechat }"
                aria-hidden="true"
              />
              <button
                type="button"
                class="im-tab im-tab--wechat"
                :class="{ 'im-tab--active': isWechat }"
                :aria-pressed="isWechat"
                @click="channel = 'WECHAT'"
              >
                {{ t('contact.wechatLabel') }}
              </button>
              <button
                type="button"
                class="im-tab im-tab--qq"
                :class="{ 'im-tab--active': !isWechat }"
                :aria-pressed="!isWechat"
                @click="channel = 'QQ'"
              >
                {{ t('contact.qqLabel') }}
              </button>
            </div>
          </div>
          <!-- out-in 翻页式过渡：旧码向内翻出、新码翻入，像翻名片 -->
          <Transition name="qr-flip" mode="out-in">
            <div v-if="isWechat" class="im-panel">
              <img :src="wechatQrUrl" :alt="t('contact.wechatQrAlt')" class="im-qr" />
              <p class="desc desc--center">{{ t('contact.wechatDesc') }}</p>
            </div>
            <div v-else class="im-panel">
              <img :src="qqQrUrl" :alt="t('contact.qqQrAlt')" class="im-qr" />
              <!-- i18n-t 具名插槽把「可点击复制的群号」嵌进译文，中英共用一套结构 -->
              <i18n-t keypath="contact.qqDesc" tag="p" scope="global" class="desc desc--center">
                <template #n>
                  <button
                    type="button"
                    class="copy-id"
                    :class="{ 'copy-id--done': copied }"
                    :aria-label="t('contact.qqCopyAria')"
                    @click="copyGroupNumber"
                  >
                    {{ QQ_GROUP_NUMBER }}
                    <svg
                      v-if="!copied"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <svg
                      v-else
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span class="visually-hidden" role="status">
                      {{ copied ? t('contact.qqCopied') : '' }}
                    </span>
                  </button>
                </template>
              </i18n-t>
            </div>
          </Transition>
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

/* 微信品牌绿 / QQ 品牌蓝：与 Telegram 同理，局部固定色；切换时颜色平滑过渡 */
.icon--wechat {
  color: #07c160;
  transition: color 0.3s ease;
}

.icon--qq {
  color: #12b7f5;
}

/* 微信 / QQ 分段切换：滑块 pill，选中态由滑动的 thumb 承载 */
.im-toggle {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 999px;
  background: var(--muted);
  border: 1px solid var(--border);
}

.im-tab {
  position: relative;
  z-index: 1;
  width: 86px;
  padding: 7px 0;
  border: 0;
  background: none;
  cursor: pointer;
  border-radius: 999px;
  font: 600 12px var(--font-sans);
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text2);
  transition: color 0.25s ease;
}

.im-tab--active.im-tab--wechat {
  color: #07c160;
}

.im-tab--active.im-tab--qq {
  color: #12b7f5;
}

/* 滑块：带轻微回弹的位移动画，是切换动效的主角 */
.im-thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: 86px;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: transform 0.32s cubic-bezier(0.45, 1.45, 0.4, 1);
}

.im-thumb--qq {
  transform: translateX(86px);
}

/* 二维码 + 说明作为一个整体面板参与翻转过渡 */
.im-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.qr-flip-enter-active,
.qr-flip-leave-active {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

.qr-flip-enter-from {
  transform: perspective(720px) rotateY(-58deg) scale(0.94);
  opacity: 0;
}

.qr-flip-leave-to {
  transform: perspective(720px) rotateY(58deg) scale(0.94);
  opacity: 0;
}

/* 群号复制按钮：嵌在描述句内，虚线下划线提示可点，复制成功变对勾 */
.copy-id {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  color: var(--text);
  border-bottom: 1px dashed var(--border2);
  transition: color 0.2s ease;
}

.copy-id:hover {
  color: #12b7f5;
}

/* 双类写法抬高特异性：已复制的绿色反馈要盖过 :hover 蓝 */
.copy-id.copy-id--done {
  color: var(--accent-deep);
}

/* 二维码原图自带白底名片版式，深色主题下保持白底以保证可扫描；
   两张原图宽高比不同，按高度对齐避免切换时卡片高度跳动 */
.im-qr {
  position: relative;
  height: 312px;
  width: auto;
  max-width: 100%;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.07);
}

@media (prefers-reduced-motion: reduce) {
  .icon--wechat,
  .im-tab,
  .im-thumb,
  .qr-flip-enter-active,
  .qr-flip-leave-active {
    transition: none;
  }
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
