# Contact 联系页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按设计图新建独立 Contact 页（邮件支持卡片 + Telegram 群链接卡片，去掉个人账号 @Mintpop_Jack），并把页头/页脚「联系我们」入口从 `/legal#contact` 改为跳转该页。

**Architecture:** 沿用站点既有模式——`BASE_ROUTES` 双语树自动派生 `/contact` 与 `/zh/contact`，SEO 配置加 `CONTACT` 条目（契约测试自动守护一致性），文案进 `en.ts`/`zh.ts`（`typeof en` 编译期约束同构），常量收口 `config/site.ts`。ContactView 复用 AppHeader/AppFooter 作站点骨架；为此把页头/页脚中 home 专属的 `#top`/`#capabilities` 裸锚点改为带 `lp('/')` 前缀的 RouterLink，使其在任何页面都可用（`scrollBehavior` 已支持 hash 平滑滚动）。

**Tech Stack:** Vue 3 + vue-router + vue-i18n + vite-ssg + @unhead/vue v2 + Vitest/@vue/test-utils。命令一律 `mise run <task>`。

**Spec:** `docs/superpowers/specs/2026-07-04-contact-page-design.md`

## Global Constraints

- Telegram 群链接：`https://t.me/+NpAwBIWXs8FkMzVh`（页面**不得出现** `Mintpop_Jack` 字样）
- 支持邮箱：`support@mintpop.ai`
- 所有注释/文档/提交信息用简体中文；枚举/路由 name 用 SCREAMING_SNAKE_CASE（`CONTACT`）
- @unhead/vue 锁 v2；测试中给用到 `useSeo` 的组件挂 `createHead()`（`@unhead/vue/client`）
- 命令走 mise：`mise run test` / `mise run lint` / `mise run typecheck` / `mise run build`
- 提交信息末尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: ContactView 页面 + 配置接线（常量 / SEO / 路由 / i18n）

**Files:**
- Create: `src/views/ContactView.vue`
- Create: `src/views/ContactView.test.ts`
- Modify: `src/config/site.ts`（加两个常量）
- Modify: `src/config/seo.ts`（`SeoRouteKey` 加 `'CONTACT'` + `SEO.CONTACT` 条目）
- Modify: `src/router/index.ts`（`BASE_ROUTES` 加一条）
- Modify: `src/locales/en.ts` / `src/locales/zh.ts`（加 `contact` 段）

**Interfaces:**
- Consumes: `useSeo(key)`、`useLocale()`、`createAppI18n()`、`localizePath`——均已存在
- Produces: 路由 `/contact`、`/zh/contact`；常量 `SUPPORT_EMAIL`、`TELEGRAM_GROUP_URL`（`@/config/site`）；i18n `contact.*` 词条——Task 2 的入口链接依赖 `/contact` 路由存在

- [ ] **Step 1: 写失败测试** `src/views/ContactView.test.ts`

```ts
import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import ContactView from '@/views/ContactView.vue'

// 组件级守护：联系页只暴露邮件支持与 Telegram 群链接两个渠道；
// 个人账号 @Mintpop_Jack 已按需求移除，断言防止回潮
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  return mount(ContactView, {
    global: { plugins: [router, createAppI18n(), createHead()] },
  })
}

describe('ContactView 联系渠道', () => {
  it('渲染邮件支持的 mailto 链接', async () => {
    const wrapper = await mountAt('/contact')
    const mail = wrapper.find('a.email')
    expect(mail.attributes('href')).toBe('mailto:support@mintpop.ai')
    expect(mail.text()).toBe('support@mintpop.ai')
  })

  it('Telegram 卡片是指向群邀请链接的新窗口外链', async () => {
    const wrapper = await mountAt('/contact')
    const tg = wrapper.find('a.tg-link')
    expect(tg.attributes('href')).toBe('https://t.me/+NpAwBIWXs8FkMzVh')
    expect(tg.attributes('target')).toBe('_blank')
    expect(tg.attributes('rel')).toBe('noopener')
  })

  it('页面不出现个人账号 Mintpop_Jack', async () => {
    const wrapper = await mountAt('/contact')
    expect(wrapper.text()).not.toContain('Mintpop_Jack')
  })

  it('中文路由下渲染中文标题', async () => {
    const wrapper = await mountAt('/zh/contact')
    expect(wrapper.find('h1.title').text()).toBe('联系我们')
  })
})
```

注意：`createAppI18n()` 的语言由路由守卫设置（main.ts），测试里没有守卫——中文断言依赖组件内不依赖全局 locale 的写法不可行，故 ContactView 的 `t()` 走 `useI18n()` 全局实例，测试中需手动同步语言。**在 `mountAt` 里 push 后补一行**：

```ts
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? 'en'
  return mount(ContactView, {
    global: { plugins: [router, i18n, createHead()] },
  })
```

（替换上面 `createAppI18n()` 直接入插件的写法；`'en'` 字面量与 `Locale.EN` 等价，导入 `Locale` 用 `Locale.EN` 更规范。）

- [ ] **Step 2: 跑测试确认失败**

Run: `mise run test`
Expected: FAIL——`Failed to resolve import "@/views/ContactView.vue"`（文件不存在）

- [ ] **Step 3: 加常量** `src/config/site.ts`（`CONSOLE_URL` 之后）

```ts
// 联系渠道:支持邮箱与 Telegram 群邀请链接,改这里全站生效
export const SUPPORT_EMAIL = 'support@mintpop.ai'
export const TELEGRAM_GROUP_URL = 'https://t.me/+NpAwBIWXs8FkMzVh'
```

- [ ] **Step 4: 加 SEO 条目** `src/config/seo.ts`

`SeoRouteKey` 联合类型加 `'CONTACT'`：

```ts
export type SeoRouteKey = 'HOME' | 'CONTACT' | 'LEGAL' | 'LOGIN' | 'REGISTER' | 'NOT_FOUND'
```

`SEO` 对象 `HOME` 之后加（可收录，自动进 sitemap 与 hreflang）：

```ts
  CONTACT: {
    path: '/contact',
    copy: {
      [Locale.EN]: {
        title: 'Contact — MintPop',
        description:
          'Contact MintPop — email support and Telegram group for billing, account, credit-limit, and compliance questions.',
      },
      [Locale.ZH]: {
        title: '联系我们 — MintPop',
        description: '联系 MintPop——邮件支持与 Telegram 群，解答账单、账户、额度与合规相关问题。',
      },
    },
  },
```

- [ ] **Step 5: 加路由** `src/router/index.ts` 的 `BASE_ROUTES`，`HOME` 条目之后：

```ts
  {
    path: '/contact',
    name: 'CONTACT',
    component: () => import('@/views/ContactView.vue'),
    zh: true,
  },
```

- [ ] **Step 6: 加 i18n 词条**

`src/locales/en.ts`（`modalities` 段之后、`footer` 之前加）：

```ts
  contact: {
    title: 'Contact',
    intro:
      'MintPop is an API access relay and quota-management service for overseas developers and cross-border teams. Reach us through any channel below — we typically reply within one business day.',
    emailLabel: 'Email Support',
    emailDesc: 'Billing, account, credit-limit, and compliance questions.',
    telegramLabel: 'Telegram',
    telegramJoin: 'Join our Telegram group',
  },
```

`src/locales/zh.ts`（同位置）：

```ts
  contact: {
    title: '联系我们',
    intro:
      'MintPop 是面向海外开发者与跨境团队的 API 中转与额度管理服务。你可以通过以下任一渠道联系我们——通常会在一个工作日内回复。',
    emailLabel: '邮件支持',
    emailDesc: '账单、账户、额度上限与合规相关问题。',
    telegramLabel: 'Telegram',
    telegramJoin: '加入我们的 Telegram 群',
  },
```

- [ ] **Step 7: 实现视图** `src/views/ContactView.vue`

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { SUPPORT_EMAIL, TELEGRAM_GROUP_URL } from '@/config/site'

// 联系页:邮件支持 + Telegram 群两个渠道(个人账号已按需求移除,见组件测试守护)
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

/* Telegram 品牌蓝:局部固定色,不随主题变量走 */
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
```

注意：若 `theme.css` 中无 `--accent-soft2` 变量，改用 `--accent-soft`（实现时 grep 确认变量存在，PlaceholderPage 的 hover 用过 `--accent-soft2`，应已存在）。

- [ ] **Step 8: 跑测试确认通过**

Run: `mise run test`
Expected: PASS（含既有路由↔SEO 契约测试——新增 CONTACT 条目被自动覆盖）

- [ ] **Step 9: 类型检查**

Run: `mise run typecheck`
Expected: 通过（`zh.ts` 若漏 `contact` 段会在此报错）

- [ ] **Step 10: 提交**

```bash
git add src/views/ContactView.vue src/views/ContactView.test.ts src/config/site.ts src/config/seo.ts src/router/index.ts src/locales/en.ts src/locales/zh.ts
git commit -m "feat: 新增 Contact 联系页（邮件支持 + Telegram 群链接）

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 页头/页脚入口改造（联系我们 → /contact，锚点链接全站可用）

**Files:**
- Modify: `src/components/AppHeader.vue`（logo/锚点/联系链接）
- Modify: `src/components/AppFooter.vue`（logo/联系链接）
- Modify: `src/components/AppHeader.test.ts`（补断言）
- Create: `src/components/AppFooter.test.ts`

**Interfaces:**
- Consumes: Task 1 产出的 `/contact` 路由与 `lp()`（`useLocale`，已存在）
- Produces: 无新接口，纯链接指向变更

- [ ] **Step 1: 补失败测试**

`src/components/AppHeader.test.ts` 末尾新增 describe：

```ts
describe('AppHeader 导航链接', () => {
  it('联系我们指向独立联系页，中文页带 /zh 前缀', async () => {
    const en = await mountAt('/')
    expect(en.find('a.nav-link--accent').attributes('href')).toBe('/contact')
    const zh = await mountAt('/zh')
    expect(zh.find('a.nav-link--accent').attributes('href')).toBe('/zh/contact')
  })

  it('区块锚点与 logo 带首页路径前缀，非首页也能回到首页对应区块', async () => {
    const wrapper = await mountAt('/contact')
    expect(wrapper.find('a.logo-link').attributes('href')).toBe('/#top')
    const anchors = wrapper.findAll('a.nav-link').map((a) => a.attributes('href'))
    expect(anchors).toContain('/#capabilities')
    expect(anchors).toContain('/#modalities')
  })
})
```

新建 `src/components/AppFooter.test.ts`：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'

// 组件级守护：页脚「联系我们」指向独立联系页（而非旧的 /legal#contact 锚点）
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  return mount(AppFooter, { global: { plugins: [router, createAppI18n()] } })
}

describe('AppFooter 联系链接', () => {
  it('英文页指向 /contact', async () => {
    const wrapper = await mountAt('/')
    const hrefs = wrapper.findAll('nav.links a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/contact')
    expect(hrefs).not.toContain('/legal#contact')
  })

  it('中文页指向 /zh/contact', async () => {
    const wrapper = await mountAt('/zh')
    const hrefs = wrapper.findAll('nav.links a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/zh/contact')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `mise run test`
Expected: 新增断言 FAIL（现值为 `/legal#contact`、`#top` 等）

- [ ] **Step 3: 改 AppHeader.vue**

logo（原 `<a href="#top" class="logo-link">`）改为：

```vue
    <RouterLink :to="`${lp('/')}#top`" class="logo-link">
      <BrandLogo :size="24" />
    </RouterLink>
```

nav 区（原两个裸锚点 + 指向 `/legal#contact` 的联系链接）改为：

```vue
    <nav class="nav">
      <RouterLink :to="`${lp('/')}#capabilities`" class="nav-link">
        {{ t('nav.capabilities') }}
      </RouterLink>
      <RouterLink :to="`${lp('/')}#modalities`" class="nav-link">
        {{ t('nav.modalities') }}
      </RouterLink>
      <RouterLink :to="lp('/legal')" class="nav-link">{{ t('nav.legal') }}</RouterLink>
      <RouterLink :to="lp('/contact')" class="nav-link nav-link--accent">
        {{ t('nav.contact') }}
      </RouterLink>
    </nav>
```

（`lp('/')` 在中文页返回 `/zh`，锚点拼成 `/zh#capabilities`；`scrollBehavior` 已处理 hash 平滑滚动，首页内点击行为不变。）

- [ ] **Step 4: 改 AppFooter.vue**

logo 改为 `<RouterLink :to="`${lp('/')}#top`" class="logo-link">`（闭合标签同步改 `</RouterLink>`）；联系链接改为：

```vue
        <RouterLink :to="lp('/contact')" class="link">
          {{ t('footer.contact') }}
        </RouterLink>
```

- [ ] **Step 5: 跑测试确认通过**

Run: `mise run test`
Expected: PASS（全部）

- [ ] **Step 6: 全量质量门禁**

Run: `mise run lint && mise run typecheck && mise run test && mise run build`
Expected: 全绿；`mise run build`（vite-ssg）产出 `dist/contact/index.html` 与 `dist/zh/contact/index.html`

- [ ] **Step 7: 提交**

```bash
git add src/components/AppHeader.vue src/components/AppFooter.vue src/components/AppHeader.test.ts src/components/AppFooter.test.ts
git commit -m "feat: 页头页脚「联系我们」改指联系页，首页锚点链接全站可用

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
