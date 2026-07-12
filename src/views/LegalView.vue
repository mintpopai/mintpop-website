<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useLocale } from '@/composables/useLocale'
import { useSeo } from '@/composables/useSeo'
import { SUPPORT_EMAIL } from '@/config/site'
import { ANCHOR_SCROLL_OFFSET } from '@/router'

// 协议页：服务条款 / 隐私政策 / 退款政策 / 可接受使用政策四份文件 + 联系卡片。
// 联系入口按需求走站内跳转到联系页（不放 mailto）；条款正文内的邮箱统一取 SUPPORT_EMAIL。
// 锚点 id（terms/privacy/refund/aup/contact）与页脚链接一一对应，改动需两处同步。
useSeo('LEGAL')
const { t } = useI18n()
const { lp } = useLocale()

// 侧栏目录：锚点与文档标题词条的对应关系（contact 条目标题取自 about 卡片）
const DOC_ANCHORS = [
  { hash: '#terms', titleKey: 'legal.terms.title' },
  { hash: '#privacy', titleKey: 'legal.privacy.title' },
  { hash: '#refund', titleKey: 'legal.refund.title' },
  { hash: '#aup', titleKey: 'legal.aup.title' },
  { hash: '#contact', titleKey: 'legal.about.title' },
]

// 目录滚动侦测（scroll-spy）：命中带贴着锚点落点线（header 下 ANCHOR_SCROLL_OFFSET 处，
// 下探到视口 25%），与锚点跳转的落点语义一致——跳到哪份文档就点亮哪份。若放视口中部，
// 矮卡片（如退款政策）跳转后落在带上方，会误点亮下一份文档。多份文档同时命中时取
// 文档顺序里最靠后的（其标题已进入 header 下方，即当前阅读位置）。
// 纯浏览器端增强，放 onMounted（SSG 构建期与水合首帧都不执行，无 mismatch 风险）。
const activeHash = ref('')
let spy: IntersectionObserver | undefined

onMounted(() => {
  const hit = new Set<string>()
  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          hit.add(entry.target.id)
        } else {
          hit.delete(entry.target.id)
        }
      }
      // 命中集为空（滑过卡片间隙）时保持原高亮，避免闪烁
      // （findLast 需 lib es2023，项目 lib 未含，用 slice+reverse 等价实现）
      const current = DOC_ANCHORS.slice()
        .reverse()
        .find((doc) => hit.has(doc.hash.slice(1)))
      if (current) {
        activeHash.value = current.hash
      }
    },
    { rootMargin: `-${ANCHOR_SCROLL_OFFSET}px 0px -75% 0px` },
  )
  for (const doc of DOC_ANCHORS) {
    const el = document.getElementById(doc.hash.slice(1))
    if (el) {
      spy.observe(el)
    }
  }
})

onBeforeUnmount(() => spy?.disconnect())
</script>

<template>
  <AppHeader />
  <main class="legal">
    <!-- 页头：eyebrow + 标题 + 简介，右上角网点纹理延续全站 halftone 母题 -->
    <section class="page-head">
      <div class="head-dots" aria-hidden="true" />
      <div class="head-inner">
        <p class="eyebrow">{{ t('legal.eyebrow') }}</p>
        <h1 class="title">{{ t('legal.title') }}</h1>
        <p class="intro">{{ t('legal.intro') }}</p>
      </div>
    </section>

    <div class="body">
      <!-- 侧栏文档目录：锚点跳转走 RouterLink，交给路由 scrollBehavior 平滑滚动 -->
      <aside class="side">
        <p class="side-label">{{ t('legal.docsLabel') }}</p>
        <nav class="side-nav">
          <RouterLink
            v-for="doc in DOC_ANCHORS"
            :key="doc.hash"
            :to="{ hash: doc.hash }"
            class="side-link"
            :class="{ 'side-link--active': activeHash === doc.hash }"
            :aria-current="activeHash === doc.hash ? 'true' : undefined"
          >
            {{ t(doc.titleKey) }}
          </RouterLink>
        </nav>
        <RouterLink :to="lp('/contact')" class="side-card">
          <span class="side-card-label">{{ t('legal.questionsLabel') }}</span>
          <span class="side-card-link">{{ t('legal.questionsLink') }} →</span>
        </RouterLink>
      </aside>

      <!-- 文档正文 -->
      <div class="docs">
        <article id="terms" class="doc">
          <h2 class="doc-title">{{ t('legal.terms.title') }}</h2>
          <p class="doc-date">{{ t('legal.lastUpdated') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s1Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s1Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s2Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s2Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s3Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s3Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s4Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s4Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s5Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s5Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s6Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s6Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s7Title') }}</h3>
          <p class="sec-body">{{ t('legal.terms.s7Body') }}</p>
          <h3 class="sec-title">{{ t('legal.terms.s8Title') }}</h3>
          <p class="sec-body sec-body--last">
            {{ t('legal.terms.s8Body', { email: SUPPORT_EMAIL }) }}
          </p>
        </article>

        <article id="privacy" class="doc">
          <h2 class="doc-title">{{ t('legal.privacy.title') }}</h2>
          <p class="doc-date">{{ t('legal.lastUpdated') }}</p>
          <h3 class="sec-title">{{ t('legal.privacy.s1Title') }}</h3>
          <ul class="sec-list">
            <li>{{ t('legal.privacy.s1Item1') }}</li>
            <li>{{ t('legal.privacy.s1Item2') }}</li>
            <li>{{ t('legal.privacy.s1Item3') }}</li>
          </ul>
          <h3 class="sec-title">{{ t('legal.privacy.s2Title') }}</h3>
          <p class="sec-body">{{ t('legal.privacy.s2Body') }}</p>
          <h3 class="sec-title">{{ t('legal.privacy.s3Title') }}</h3>
          <p class="sec-body">{{ t('legal.privacy.s3Body') }}</p>
          <h3 class="sec-title">{{ t('legal.privacy.s4Title') }}</h3>
          <p class="sec-body">{{ t('legal.privacy.s4Body') }}</p>
          <h3 class="sec-title">{{ t('legal.privacy.s5Title') }}</h3>
          <p class="sec-body">{{ t('legal.privacy.s5Body', { email: SUPPORT_EMAIL }) }}</p>
          <h3 class="sec-title">{{ t('legal.privacy.s6Title') }}</h3>
          <p class="sec-body sec-body--last">
            {{ t('legal.privacy.s6Body', { email: SUPPORT_EMAIL }) }}
          </p>
        </article>

        <article id="refund" class="doc">
          <h2 class="doc-title">{{ t('legal.refund.title') }}</h2>
          <p class="doc-date">{{ t('legal.lastUpdated') }}</p>
          <ul class="sec-list sec-list--loose">
            <li>{{ t('legal.refund.item1') }}</li>
            <li>{{ t('legal.refund.item2') }}</li>
            <li>{{ t('legal.refund.item3') }}</li>
            <li>{{ t('legal.refund.item4', { email: SUPPORT_EMAIL }) }}</li>
          </ul>
        </article>

        <article id="aup" class="doc">
          <h2 class="doc-title">{{ t('legal.aup.title') }}</h2>
          <p class="sec-body sec-body--intro">{{ t('legal.aup.intro') }}</p>
          <ul class="sec-list sec-list--loose">
            <li>{{ t('legal.aup.item1') }}</li>
            <li>{{ t('legal.aup.item2') }}</li>
            <li>{{ t('legal.aup.item3') }}</li>
            <li>{{ t('legal.aup.item4') }}</li>
            <li>{{ t('legal.aup.item5') }}</li>
          </ul>
          <p class="sec-body sec-body--outro">{{ t('legal.aup.outro') }}</p>
        </article>

        <article id="contact" class="doc">
          <h2 class="doc-title">{{ t('legal.about.title') }}</h2>
          <p class="sec-body sec-body--intro">{{ t('legal.about.body') }}</p>
          <RouterLink :to="lp('/contact')" class="contact-cta">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M3.5 7l8.5 6 8.5-6" />
            </svg>
            <span class="contact-cta-text">
              {{ t('legal.about.ctaLabel') }}
              <span class="contact-cta-link">{{ t('legal.about.ctaLink') }} →</span>
            </span>
          </RouterLink>
        </article>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.legal {
  background: var(--bg);
}

/* ---- 页头 ---- */
.page-head {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  padding: 64px 44px 52px;
}

/* 签名装饰：薄荷网点纹理，与 Hero / 联系页同一 halftone 视觉语言 */
.head-dots {
  position: absolute;
  right: -150px;
  top: -60px;
  width: 440px;
  height: 440px;
  background: linear-gradient(150deg, var(--accent-deep) 0%, var(--accent) 45%, transparent 92%);
  -webkit-mask-image: radial-gradient(#000 2px, transparent 2.2px);
  mask-image: radial-gradient(#000 2px, transparent 2.2px);
  -webkit-mask-size: 20px 20px;
  mask-size: 20px 20px;
  opacity: 0.11;
  pointer-events: none;
}

.head-inner {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 16px;
  font: 600 12px var(--font-sans);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.title {
  margin: 0;
  font: 500 52px var(--font-serif);
  letter-spacing: -0.015em;
  color: var(--text);
}

.intro {
  margin: 16px 0 0;
  max-width: 620px;
  font: 400 17px var(--font-sans);
  line-height: 1.6;
  color: var(--text2);
}

/* ---- 正文：侧栏目录 + 文档卡片 ---- */
.body {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  gap: 56px;
  padding: 56px 44px 100px;
  align-items: flex-start;
}

.side {
  position: sticky;
  top: 104px;
  flex: none;
  width: 212px;
}

.side-label {
  margin: 0 0 10px;
  padding: 0 14px;
  font: 600 11px var(--font-sans);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ph);
}

/* 目录挂在一条 hairline 纵轨上：轨道即阅读进度的坐标系 */
.side-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  border-left: 1px solid var(--border);
}

.side-link {
  position: relative;
  font: 500 14px var(--font-sans);
  padding: 10px 14px;
  border-radius: 0 10px 10px 0;
  color: var(--text2);
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.side-link:hover {
  background: var(--muted);
}

/* 当前阅读位置：hairline 上点亮一段 mint 短轨（scroll-spy 驱动） */
.side-link--active {
  color: var(--text);
  background: var(--muted);
}

.side-link--active::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 1px;
  background: var(--accent);
}

.side-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 22px;
  padding: 16px;
  border-radius: 14px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  transition: background-color 0.18s ease;
}

.side-card:hover {
  background: var(--accent-soft2);
}

.side-card-label {
  font: 500 12px var(--font-sans);
  color: var(--text2);
}

.side-card-link {
  font: 600 13px var(--font-sans);
  color: var(--accent);
}

.docs {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.doc {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 44px 46px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.04);
}

.doc-title {
  margin: 0;
  font: 500 32px var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--text);
}

.doc-date {
  margin: 8px 0 28px;
  font: 400 13px var(--font-sans);
  color: var(--ph);
}

.sec-title {
  margin: 0 0 8px;
  font: 600 16px var(--font-sans);
  color: var(--text);
}

.sec-body {
  margin: 0 0 22px;
  font: 400 15px var(--font-sans);
  line-height: 1.72;
  color: var(--text2);
}

.sec-body--last {
  margin-bottom: 0;
}

.sec-body--intro {
  margin: 14px 0 18px;
}

.sec-body--outro {
  margin: 22px 0 0;
}

.sec-list {
  margin: 0 0 22px;
  padding-left: 20px;
  font: 400 15px var(--font-sans);
  line-height: 1.72;
  color: var(--text2);
}

.sec-list li::marker {
  color: var(--accent);
}

/* 退款/AUP 这类整卡就是一张清单的，行距放宽且不留底边距 */
.sec-list--loose {
  margin-bottom: 0;
  line-height: 1.85;
}

/* 联系卡片内的站内跳转 CTA（按需求替代 mailto） */
.contact-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 13px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  transition: background-color 0.18s ease;
}

.contact-cta:hover {
  background: var(--accent-soft2);
}

.contact-cta-text {
  font: 600 15px var(--font-sans);
  color: var(--text);
}

.contact-cta-link {
  color: var(--accent);
}

/* 键盘可达：三类可交互元素统一 mint 焦点环 */
.side-link:focus-visible,
.side-card:focus-visible,
.contact-cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .page-head {
    padding: 48px 24px 40px;
  }

  .title {
    font-size: 40px;
  }

  .body {
    flex-direction: column;
    gap: 32px;
    padding: 40px 24px 80px;
  }

  /* 窄屏下目录不再吸附，改为横向换行的标签组 */
  .side {
    position: static;
    width: 100%;
  }

  .side-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
    border-left: 0;
  }

  .side-link {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
  }

  /* 窄屏无纵轨，激活态改用薄荷 chip 表达 */
  .side-link--active {
    border-color: var(--accent-border);
    background: var(--accent-soft);
    color: var(--accent);
  }

  .side-link--active::before {
    content: none;
  }

  .doc {
    padding: 32px 26px;
  }
}
</style>
