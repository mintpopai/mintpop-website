<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import BrandLogo from '@/components/BrandLogo.vue'
import { rememberLocale, useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { API_URL } from '@/config/site'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()
const { lp, otherLocale, otherLabel, switchTarget } = useLocale()
</script>

<template>
  <header class="header">
    <!-- 锚点与 logo 带首页路径前缀：页头也挂载在联系页等非首页，裸锚点在那里会失效 -->
    <RouterLink :to="`${lp('/')}#top`" class="logo-link">
      <BrandLogo :size="24" />
    </RouterLink>

    <!-- 页头只留动作区：法律条款按惯例只放页脚，联系我们归入右侧动作 -->
    <div class="actions">
      <RouterLink :to="lp('/products')" class="contact-link products-link">
        {{ t('nav.products') }}
      </RouterLink>
      <RouterLink :to="lp('/contact')" class="contact-link">
        {{ t('nav.contact') }}
      </RouterLink>
      <!-- 链接式切换器：指向当前页在另一语言的对等路径，爬虫可循此发现中文页；点击记住偏好 -->
      <RouterLink
        :to="switchTarget"
        class="lang"
        :aria-label="t('nav.switchLocale')"
        @click="rememberLocale(otherLocale)"
      >
        {{ otherLabel }}
      </RouterLink>
      <button
        type="button"
        class="theme-toggle"
        :aria-label="isDark ? t('nav.switchToLight') : t('nav.switchToDark')"
        :aria-pressed="isDark"
        @click="toggleTheme"
      >
        <span class="theme-icon" aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
      </button>
      <a :href="API_URL" target="_blank" rel="noopener" class="login-btn">
        {{ t('nav.login') }}
      </a>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 44px;
  height: 74px;
  background: var(--bar);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.logo-link {
  display: flex;
  align-items: flex-end;
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.contact-link {
  font: 500 14px var(--font-sans);
  padding: 9px 15px;
  border-radius: 10px;
  color: var(--text2);
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.contact-link:hover {
  color: var(--text);
  background: var(--muted);
}

.lang {
  font: 500 13px var(--font-sans);
  color: var(--text2);
}

.lang:hover {
  color: var(--accent);
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: var(--text2);
  transition: border-color 0.18s ease;
}

.theme-toggle:hover {
  border-color: var(--accent);
}

.theme-icon {
  font-size: 17px;
  line-height: 1;
}

.login-btn {
  font: 600 14px var(--font-sans);
  color: var(--accent);
  padding: 9px 18px;
  border-radius: 11px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.18s ease;
}

.login-btn:hover {
  background: var(--accent-soft2);
}

@media (max-width: 720px) {
  .header {
    padding: 0 18px;
    gap: 14px;
  }

  /* 小屏优先保联系入口的可达性由页脚兜底，页头只留核心动作 */
  .contact-link {
    display: none;
  }
}
</style>
