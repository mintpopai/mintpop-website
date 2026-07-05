<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { CONSOLE_URL } from '@/config/site'

const { t, locale } = useI18n()
</script>

<template>
  <section id="top" class="hero">
    <!-- 装饰层：warhol 网点渐变 + 网点底纹 + 中央光晕（纯展示，不可交互） -->
    <div class="deco deco-dots-accent" aria-hidden="true" />
    <div class="deco deco-dots-ink" aria-hidden="true" />
    <div class="deco deco-glow" aria-hidden="true" />

    <div class="hero-inner">
      <div class="badge">
        <span class="badge-icon">✦</span>
        <span class="badge-text">{{ t('hero.badge') }}</span>
      </div>

      <!-- :key="locale"：中英文标题的子节点结构不保证一致，切换语言时必须整体重挂载；
           否则 Vue 按位置复用无 key 的 span 且不重 patch 静态 class，「文本」会丢失强调色 -->
      <i18n-t :key="locale" keypath="hero.headline" tag="h1" class="headline">
        <!-- {br}：标题固定两行，中英文都在第一段后换行 -->
        <template #br><br /></template>
        <template #text>
          <span class="em em-accent">{{ t('hero.text') }}</span>
        </template>
        <template #vision>
          <span class="em">{{ t('hero.vision') }}</span>
        </template>
        <template #voice>
          <span class="em">{{ t('hero.voice') }}</span>
        </template>
      </i18n-t>

      <!-- 已接入模型卡片：品牌名不参与 i18n；logo 为内联 SVG（第三方资源须自托管，见全局可达性规范） -->
      <div class="models">
        <span class="model">
          <svg class="model-logo" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#d97757"
              d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
            />
          </svg>
          Claude
        </span>
        <span class="model">
          <svg class="model-logo" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="var(--text)"
              d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zM13.2599 22.4301a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6455zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865a4.504 4.504 0 0 1-1.6464-6.1408zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"
            />
          </svg>
          GPT
        </span>
        <span class="model">
          <svg class="model-logo" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <!-- 双层渐变近似 Gemini 新版四色菱形：底层左黄右蓝，叠加层上红下绿、中段透明 -->
              <linearGradient id="gemini-base" x1="0" y1="0.5" x2="1" y2="0.5">
                <stop offset="0" stop-color="#f9ab00" />
                <stop offset="0.65" stop-color="#4285f4" />
              </linearGradient>
              <linearGradient id="gemini-tint" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0" stop-color="#e94235" />
                <stop offset="0.4" stop-color="#e94235" stop-opacity="0" />
                <stop offset="0.6" stop-color="#34a853" stop-opacity="0" />
                <stop offset="1" stop-color="#34a853" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gemini-base)"
              d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.304 14.304 0 0 0 12 12 14.304 14.304 0 0 0-12 12"
            />
            <path
              fill="url(#gemini-tint)"
              d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.304 14.304 0 0 0 12 12 14.304 14.304 0 0 0-12 12"
            />
          </svg>
          Gemini
        </span>
      </div>

      <div class="cta-row">
        <a :href="CONSOLE_URL" target="_blank" rel="noopener" class="btn btn-primary">
          {{ t('hero.getStarted') }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="#fff"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        <a href="#capabilities" class="btn btn-ghost">{{ t('hero.explore') }}</a>
      </div>

      <div class="tags">
        <span class="tag">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M7 8l-4 4 4 4" />
            <path d="M17 8l4 4-4 4" />
            <path d="M14 4l-4 16" />
          </svg>
          {{ t('hero.tagUnifiedApi') }}
        </span>
        <span class="tag">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3l8 4v5c0 4.4-3.1 7.6-8 9-4.9-1.4-8-4.6-8-9V7l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          {{ t('hero.tagSession') }}
        </span>
        <span class="tag">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
          </svg>
          {{ t('hero.tagPayg') }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 120px 44px 96px;
}

.deco {
  position: absolute;
  pointer-events: none;
}

.deco-dots-accent {
  right: -180px;
  top: -40px;
  width: 560px;
  height: 560px;
  background: linear-gradient(150deg, #0fb389 0%, #17d1a7 45%, rgba(23, 209, 167, 0) 92%);
  -webkit-mask-image: radial-gradient(#000 2px, transparent 2.2px);
  mask-image: radial-gradient(#000 2px, transparent 2.2px);
  -webkit-mask-size: 20px 20px;
  mask-size: 20px 20px;
  opacity: 0.14;
}

.deco-dots-ink {
  left: -130px;
  bottom: -120px;
  width: 400px;
  height: 400px;
  background: radial-gradient(var(--ink) 1.8px, transparent 2px);
  background-size: 17px 17px;
  opacity: 0.05;
}

.deco-glow {
  left: 50%;
  top: 120px;
  transform: translateX(-50%);
  width: 900px;
  height: 480px;
  background: radial-gradient(closest-side, rgba(23, 209, 167, 0.18), rgba(23, 209, 167, 0) 72%);
  filter: blur(10px);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 18px;
  border-radius: 999px;
  background: var(--pill);
  border: 1px solid var(--pill-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(6px);
}

.badge-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font: 700 11px var(--font-sans);
}

.badge-text {
  font: 500 14px var(--font-sans);
  color: var(--text);
  white-space: nowrap;
}

.headline {
  margin: 34px 0 0;
  font: 500 78px var(--font-serif);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--text);
  text-wrap: balance;
}

.em {
  font-style: italic;
}

.em-accent {
  color: var(--accent);
}

.models {
  margin: 30px 0 0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.model {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 14px;
  background: var(--card);
  border: 1px solid var(--accent-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  font: 600 16px var(--font-sans);
  color: var(--text);
}

.model-logo {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.cta-row {
  margin-top: 38px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font: 600 16px var(--font-sans);
  border-radius: 13px;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
}

.btn-primary {
  color: #fff;
  background: var(--accent);
  padding: 15px 28px;
  box-shadow: 0 6px 18px rgba(23, 209, 167, 0.34);
}

.btn-primary:hover {
  background: var(--accent-deep);
}

.btn-ghost {
  gap: 8px;
  color: var(--text);
  padding: 15px 24px;
  border: 1px solid var(--border2);
  background: var(--card);
}

.btn-ghost:hover {
  border-color: var(--accent);
}

.tags {
  margin-top: 46px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font: 500 14px var(--font-sans);
  color: var(--text2);
  background: var(--card);
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 999px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

@media (max-width: 720px) {
  .hero {
    padding: 72px 18px 64px;
  }

  .headline {
    font-size: 44px;
  }

  .badge-text {
    white-space: normal;
  }

  .cta-row {
    flex-direction: column;
    align-self: stretch;
  }

  .btn {
    justify-content: center;
  }
}
</style>
