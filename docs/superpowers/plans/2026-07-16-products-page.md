# 「全部产品」页实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `/products`（+`/zh/products`）「全部产品」页，展示 MintPop API 与 MintPop Shop 两张产品大卡及一张 SOON 占位卡，并在页头/页脚接入入口。

**Architecture:** 沿用站内既有机制——`BASE_ROUTES` 双语路由树、`seo.ts` 单一来源派生 head/sitemap、`en.ts` 真相源 + `zh.ts` 同构类型约束的 i18n。视图内以结构化数组渲染产品卡，文案全部走 `products` 词条命名空间。

**Tech Stack:** Vue 3 `<script setup>` + TypeScript、vue-router、vue-i18n、vite-ssg、@unhead/vue、Vitest + @vue/test-utils、纯 CSS 变量主题。

**Spec:** `docs/superpowers/specs/2026-07-16-products-page-design.md`

## Global Constraints

- 所有注释、文档、commit 信息用简体中文；commit 末尾加 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 命令一律走 mise：`mise run test` / `mise run lint` / `mise run typecheck` / `mise run build` / `mise run format`。
- 页面不得引入任何第三方外链资源（图形用纯 CSS/内联 SVG），符合全球可达性规范。
- 语言唯一由 URL 决定：中文路径 = `/zh` + 英文基准路径；`seo.ts` 的 `path` 是英文基准路径。
- `zh.ts` 结构由 `typeof en` 编译期约束，新增词条两边必须同步。
- `docs/superpowers/` 已被 `.gitignore` 排除，spec/plan 文件不入库。
- 每个 Task 结束跑一次相关测试并提交；提交前确保 `mise run format` 不产生 diff。

---

### Task 1: i18n 词条与 SHOP_URL 常量

**Files:**

- Modify: `src/locales/en.ts`（`nav` 增 1 键；`footer` 增 1 键；新增 `products` 命名空间）
- Modify: `src/locales/zh.ts`（同构镜像）
- Modify: `src/config/site.ts`（新增 `SHOP_URL` 常量）

**Interfaces:**

- Consumes: 无（首个任务）。
- Produces: 词条键 `nav.products`、`footer.products`、`products.*`（结构见下）；常量 `export const SHOP_URL = 'https://shop.mintpop.ai'`。后续任务的组件用 `t('products.api.name')` 等取词条、`import { SHOP_URL } from '@/config/site'` 取地址。

- [ ] **Step 1: en.ts 增加词条**

在 `src/locales/en.ts` 的 `nav` 对象中 `contact: 'Contact',` 之前加：

```ts
    products: 'Products',
```

在 `footer` 对象中 `terms: 'Terms of Service',` 之前加：

```ts
    products: 'All Products',
```

在 `placeholder` 命名空间之前（`footer` 块之后）加整个 `products` 命名空间：

```ts
  products: {
    title: 'All Products',
    intro:
      'Everything MintPop ships today — built for overseas developers and cross-border teams.',
    live: 'LIVE',
    soon: 'SOON',
    api: {
      name: 'MintPop API',
      tagline: 'One API for text, vision, and voice — 100% official, full-power models.',
      point1: 'A single unified endpoint covering every modality.',
      point2: 'Continuously purity-tested — never blended or downgraded.',
      point3: 'Zero data retention, usage-based billing.',
      cta: 'Get Started',
    },
    shop: {
      name: 'MintPop Shop',
      tagline: 'Mainstream AI subscriptions in one store — ChatGPT Plus, Claude Pro, and more.',
      point1: 'Official top-ups through legitimate channels.',
      point2: 'Instant activation after checkout.',
      point3: 'Multiple payment methods with human after-sales support.',
      cta: 'Visit Shop',
    },
    more: {
      name: 'More coming',
      desc: 'New products are on the way.',
    },
  },
```

- [ ] **Step 2: zh.ts 同构镜像**

`nav` 对象中 `contact: '联系我们',` 之前加：

```ts
    products: '产品',
```

`footer` 对象中 `terms: '服务条款',` 之前加：

```ts
    products: '全部产品',
```

`placeholder` 之前加：

```ts
  products: {
    title: '全部产品',
    intro: 'MintPop 当前提供的全部产品——为海外开发者与跨境团队而建。',
    live: '已上线',
    soon: '敬请期待',
    api: {
      name: 'MintPop API',
      tagline: '一个 API 打通文本、视觉与语音——100% 官方满血模型。',
      point1: '单一统一端点，覆盖全部模态。',
      point2: '持续纯度实测——绝不混装、绝不降级。',
      point3: '零数据留存，按用量计费。',
      cta: '立即开始',
    },
    shop: {
      name: 'MintPop Shop',
      tagline: '主流 AI 订阅一站购齐——ChatGPT Plus、Claude Pro 等。',
      point1: '正规渠道官方直充。',
      point2: '下单后即时开通。',
      point3: '多种支付方式，真人售后支持。',
      cta: '前往商店',
    },
    more: {
      name: '更多产品',
      desc: '新产品正在路上。',
    },
  },
```

- [ ] **Step 3: site.ts 增加 SHOP_URL**

在 `src/config/site.ts` 的 `export const API_URL = 'https://api.mintpop.ai'` 之后加：

```ts
// Shop 商城地址：产品页 MintPop Shop 的 CTA 跳转目标（地址暂定，改这里全站生效）
export const SHOP_URL = 'https://shop.mintpop.ai'
```

- [ ] **Step 4: 运行词条守护测试与类型检查**

Run: `mise run test src/locales/messages.test.ts && mise run typecheck`
Expected: 词条完整性两个用例 PASS（键集合一致、全部非空）；typecheck 无错误（zh 若漏键会在此编译期报错）。

- [ ] **Step 5: Commit**

```bash
git add src/locales/en.ts src/locales/zh.ts src/config/site.ts
git commit -m "feat: 产品页词条与 SHOP_URL 常量

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 注册 /products 路由与 SEO（占位视图先行）

**Files:**

- Modify: `src/config/seo.ts`（`SeoRouteKey` 增 `'PRODUCTS'` + `SEO` 增条目）
- Modify: `src/config/seo.test.ts`（`ALL_KEYS` 增 key + noindex 断言）
- Modify: `src/router/index.ts`（`BASE_ROUTES` 增条目）
- Create: `src/views/ProductsView.vue`（骨架：h1 + intro + useSeo，产品卡下一任务填充）

**Interfaces:**

- Consumes: Task 1 的词条 `products.title`、`products.intro`。
- Produces: SEO key `'PRODUCTS'`（`useSeo('PRODUCTS')` 可用）；路由 `/products`（name `PRODUCTS`）与 `/zh/products`（name `PRODUCTS_ZH`）；组件文件 `@/views/ProductsView.vue`。Task 3 在该文件内扩展，Task 4 的页头/页脚链接指向该路由。

- [ ] **Step 1: 先改 seo.test.ts，得到失败测试**

`src/config/seo.test.ts` 中 `ALL_KEYS` 改为：

```ts
const ALL_KEYS: SeoRouteKey[] = [
  'HOME',
  'PRODUCTS',
  'CONTACT',
  'LEGAL',
  'LOGIN',
  'REGISTER',
  'NOT_FOUND',
]
```

`login/register/404 标了 noindex，home/legal 未标` 用例中 `expect(SEO.LEGAL.noindex).toBeUndefined()` 之后加一行（产品页必须可收录）：

```ts
expect(SEO.PRODUCTS.noindex).toBeUndefined()
```

- [ ] **Step 2: 运行测试确认失败**

Run: `mise run test src/config/seo.test.ts`
Expected: FAIL——TS 编译错误 `'PRODUCTS'` 不在 `SeoRouteKey` 联合类型中（类型即测试）。

- [ ] **Step 3: seo.ts 增加 PRODUCTS 条目**

`src/config/seo.ts` 中 `SeoRouteKey` 改为：

```ts
export type SeoRouteKey =
  'HOME' | 'PRODUCTS' | 'CONTACT' | 'LEGAL' | 'LOGIN' | 'REGISTER' | 'NOT_FOUND'
```

`SEO` 对象中 `HOME` 条目之后加：

```ts
  PRODUCTS: {
    path: '/products',
    copy: {
      [Locale.EN]: {
        title: 'All Products — MintPop',
        description:
          'Explore MintPop products — the MintPop API for multimodal AI, and the MintPop Shop for mainstream AI subscriptions.',
      },
      [Locale.ZH]: {
        title: '全部产品 — MintPop',
        description:
          '了解 MintPop 旗下产品——多模态 AI 统一接入的 MintPop API，与主流 AI 订阅商店 MintPop Shop。',
      },
    },
  },
```

- [ ] **Step 4: 创建 ProductsView.vue 骨架**

创建 `src/views/ProductsView.vue`：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'

// 产品页：路由/SEO 先行注册，产品卡列表在后续提交填充
useSeo('PRODUCTS')
const { t } = useI18n()
</script>

<template>
  <AppHeader />
  <main class="products">
    <div class="inner">
      <h1 class="title">{{ t('products.title') }}</h1>
      <p class="intro">{{ t('products.intro') }}</p>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
/* 页首排版与联系页同构：左对齐编辑式大标题 + 短 intro */
.products {
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

@media (max-width: 720px) {
  .products {
    padding: 72px 18px 80px;
  }

  .title {
    font-size: 40px;
  }
}
</style>
```

- [ ] **Step 5: router 注册 BASE_ROUTES 条目**

`src/router/index.ts` 的 `BASE_ROUTES` 数组中，`HOME` 条目之后加：

```ts
  {
    path: '/products',
    name: 'PRODUCTS',
    component: () => import('@/views/ProductsView.vue'),
    zh: true,
  },
```

- [ ] **Step 6: 运行契约测试确认通过**

Run: `mise run test src/config/seo.test.ts src/router/index.test.ts`
Expected: 全部 PASS（路由↔SEO path 一致、中文树派生、sitemap 派生路径都在路由表）。

- [ ] **Step 7: Commit**

```bash
git add src/config/seo.ts src/config/seo.test.ts src/router/index.ts src/views/ProductsView.vue
git commit -m "feat: 注册 /products 双语路由与 SEO，产品页骨架先行

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: 产品大卡列表（TDD）

**Files:**

- Create: `src/views/ProductsView.test.ts`
- Modify: `src/views/ProductsView.vue`（骨架扩展为完整页面）

**Interfaces:**

- Consumes: Task 1 的 `products.*` 词条、`API_URL` / `SHOP_URL` 常量；Task 2 的 `/products` 路由与 `useSeo('PRODUCTS')`。
- Produces: 页面 DOM 契约——`article.product-card` ×3（其中一张带 `product-card--soon`）、CTA 为 `a.cta` 外链。Task 4 不依赖本任务，Task 5 的 SSG 校验依赖页面可渲染。

- [ ] **Step 1: 写失败测试**

创建 `src/views/ProductsView.test.ts`：

```ts
import { createHead } from '@unhead/vue/client'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { Locale } from '@/config/locale'
import { API_URL, SHOP_URL } from '@/config/site'
import { createAppI18n } from '@/locales'
import { routes } from '@/router'
import ProductsView from '@/views/ProductsView.vue'

// 组件级守护：产品页渲染 API 与 Shop 两张在线产品大卡 + 一张 SOON 占位卡，
// CTA 分别外链到 API 平台与 Shop 商城
async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push(path)
  await router.isReady()
  // 生产环境由路由守卫按 meta.locale 同步语言（main.ts），测试无守卫，这里手动同步
  const i18n = createAppI18n()
  i18n.global.locale.value = router.currentRoute.value.meta.locale ?? Locale.EN
  return mount(ProductsView, { global: { plugins: [router, i18n, createHead()] } })
}

describe('ProductsView 产品列表', () => {
  it('渲染两张在线产品卡与一张 SOON 占位卡', async () => {
    const wrapper = await mountAt('/products')
    expect(wrapper.findAll('article.product-card')).toHaveLength(3)
    expect(wrapper.findAll('article.product-card--soon')).toHaveLength(1)
    expect(wrapper.text()).toContain('MintPop API')
    expect(wrapper.text()).toContain('MintPop Shop')
  })

  it('CTA 分别外链到 API 平台与 Shop 商城，新窗口打开', async () => {
    const wrapper = await mountAt('/products')
    const ctas = wrapper.findAll('a.cta')
    expect(ctas.map((a) => a.attributes('href'))).toEqual([API_URL, SHOP_URL])
    for (const cta of ctas) {
      expect(cta.attributes('target')).toBe('_blank')
      expect(cta.attributes('rel')).toBe('noopener')
    }
  })

  it('SOON 占位卡没有 CTA', async () => {
    const wrapper = await mountAt('/products')
    expect(wrapper.find('article.product-card--soon').find('a').exists()).toBe(false)
  })

  it('英文路由渲染英文标题，且 h1 唯一', async () => {
    const wrapper = await mountAt('/products')
    const h1s = wrapper.findAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0]!.text()).toBe('All Products')
  })

  it('中文路由渲染中文标题', async () => {
    const wrapper = await mountAt('/zh/products')
    expect(wrapper.find('h1.title').text()).toBe('全部产品')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `mise run test src/views/ProductsView.test.ts`
Expected: FAIL——`article.product-card` 数量为 0（骨架无产品卡）。

- [ ] **Step 3: 扩展 ProductsView.vue 为完整实现**

用以下完整内容覆盖 `src/views/ProductsView.vue`：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useSeo } from '@/composables/useSeo'
import { API_URL, SHOP_URL } from '@/config/site'

// 产品页：结构化数组驱动产品大卡（词条在 products 命名空间），
// 后续新增产品＝加一段词条＋一个数组项
useSeo('PRODUCTS')
const { t } = useI18n()

// key 对应词条命名空间 products.<key>，href 为 CTA 外链目标
const PRODUCTS = [
  { key: 'api', href: API_URL },
  { key: 'shop', href: SHOP_URL },
] as const

// 每个产品固定三条能力要点，模板按序号取词条
const POINT_COUNT = 3
</script>

<template>
  <AppHeader />
  <main class="products">
    <div class="inner">
      <h1 class="title">{{ t('products.title') }}</h1>
      <p class="intro">{{ t('products.intro') }}</p>

      <div class="list">
        <article v-for="p in PRODUCTS" :key="p.key" class="product-card">
          <div class="body">
            <div class="head">
              <h2 class="name">{{ t(`products.${p.key}.name`) }}</h2>
              <span class="badge badge-live">{{ t('products.live') }}</span>
            </div>
            <p class="tagline">{{ t(`products.${p.key}.tagline`) }}</p>
            <ul class="points">
              <li v-for="n in POINT_COUNT" :key="n" class="point">
                {{ t(`products.${p.key}.point${n}`) }}
              </li>
            </ul>
            <a :href="p.href" target="_blank" rel="noopener" class="cta">
              {{ t(`products.${p.key}.cta`) }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <!-- 装饰图形：薄荷 halftone 网点，延续 Hero/联系页的波普点阵母题 -->
          <div class="art" aria-hidden="true" />
        </article>

        <article class="product-card product-card--soon">
          <div class="body">
            <div class="head">
              <h2 class="name name--muted">{{ t('products.more.name') }}</h2>
              <span class="badge badge-soon">{{ t('products.soon') }}</span>
            </div>
            <p class="tagline">{{ t('products.more.desc') }}</p>
          </div>
        </article>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
/* 页首排版与联系页同构：左对齐编辑式大标题 + 短 intro */
.products {
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

.list {
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* 产品大卡：左文右图两栏；SOON 卡复用主页 More 卡的虚线视觉 */
.product-card {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 44px 40px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.045);
}

.product-card--soon {
  grid-template-columns: 1fr;
  background: var(--cream);
  border: 1px dashed var(--border2);
  box-shadow: none;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.name {
  margin: 0;
  font: 500 32px var(--font-serif);
  letter-spacing: -0.01em;
  color: var(--text);
}

.name--muted {
  color: var(--text2);
}

.badge {
  font: 600 11px var(--font-sans);
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge-live {
  color: var(--accent);
  background: var(--accent-soft);
}

.badge-soon {
  color: var(--ph);
  background: var(--muted);
}

.tagline {
  margin: 14px 0 0;
  max-width: 560px;
  font: 400 17px var(--font-sans);
  line-height: 1.6;
  color: var(--text2);
}

.points {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.point {
  position: relative;
  padding-left: 22px;
  font: 400 15px var(--font-sans);
  line-height: 1.55;
  color: var(--text2);
}

.point::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.52em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
}

.cta {
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 600 14px var(--font-sans);
  color: var(--accent);
  padding: 10px 20px;
  border-radius: 11px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  transition: background-color 0.18s ease;
}

.cta:hover {
  background: var(--accent-soft2);
}

/* 薄荷网点装饰：与联系页 wechat-dots 同款 halftone 手法，纯 CSS 无外部资源 */
.art {
  border-radius: 14px;
  background: linear-gradient(150deg, var(--accent-deep) 0%, var(--accent) 45%, transparent 92%);
  -webkit-mask-image: radial-gradient(#000 2px, transparent 2.2px);
  mask-image: radial-gradient(#000 2px, transparent 2.2px);
  -webkit-mask-size: 18px 18px;
  mask-size: 18px 18px;
  opacity: 0.16;
}

@media (max-width: 920px) {
  .product-card {
    grid-template-columns: 1fr;
  }

  .art {
    display: none;
  }
}

@media (max-width: 720px) {
  .products {
    padding: 72px 18px 80px;
  }

  .title {
    font-size: 40px;
  }

  .product-card {
    padding: 32px 24px;
  }

  .name {
    font-size: 26px;
  }
}
</style>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `mise run test src/views/ProductsView.test.ts`
Expected: 5 个用例全部 PASS。

- [ ] **Step 5: Commit**

```bash
git add src/views/ProductsView.vue src/views/ProductsView.test.ts
git commit -m "feat: 产品页大卡列表——API 与 Shop 两产品加 SOON 占位卡

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 页头/页脚接入产品页入口（TDD）

**Files:**

- Modify: `src/components/AppHeader.test.ts`（「AppHeader 导航链接」describe 增用例）
- Modify: `src/components/AppHeader.vue`（Contact 左侧加 Products 链接）
- Modify: `src/components/AppFooter.test.ts`（增用例）
- Modify: `src/components/AppFooter.vue`（链接组首位加「全部产品」）

**Interfaces:**

- Consumes: Task 1 的 `nav.products` / `footer.products` 词条；Task 2 的 `/products` 路由。
- Produces: 页头 `a.products-link`、页脚指向 `lp('/products')` 的链接（无后续任务依赖）。

- [ ] **Step 1: 写失败测试**

`src/components/AppHeader.test.ts` 的 `describe('AppHeader 导航链接', ...)` 内加用例：

```ts
it('产品页链接指向 /products，中文页带 /zh 前缀', async () => {
  const en = await mountAt('/')
  expect(en.find('a.products-link').attributes('href')).toBe('/products')
  const zh = await mountAt('/zh')
  expect(zh.find('a.products-link').attributes('href')).toBe('/zh/products')
})
```

`src/components/AppFooter.test.ts` 加 describe：

```ts
describe('AppFooter 产品链接', () => {
  it('全部产品链接指向本语言树的 /products', async () => {
    const en = await mountAt('/')
    expect(en.findAll('nav.links a').map((a) => a.attributes('href'))).toContain('/products')
    const zh = await mountAt('/zh')
    expect(zh.findAll('nav.links a').map((a) => a.attributes('href'))).toContain('/zh/products')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `mise run test src/components/AppHeader.test.ts src/components/AppFooter.test.ts`
Expected: 新增 2 个用例 FAIL（找不到链接），原有用例 PASS。

- [ ] **Step 3: AppHeader.vue 加 Products 链接**

`src/components/AppHeader.vue` 的 `.actions` 内、Contact 链接之前加（复用 `contact-link` 样式，小屏随 Contact 一同隐藏由页脚兜底；`products-link` 仅作测试与语义锚点）：

```vue
<RouterLink :to="lp('/products')" class="contact-link products-link">
        {{ t('nav.products') }}
      </RouterLink>
```

- [ ] **Step 4: AppFooter.vue 链接组首位加「全部产品」**

`src/components/AppFooter.vue` 的 `<nav class="links">` 内、第一个链接（服务条款）之前加：

```vue
<RouterLink :to="lp('/products')" class="link">{{ t('footer.products') }}</RouterLink>
<span class="sep">·</span>
```

- [ ] **Step 5: 运行测试确认通过**

Run: `mise run test src/components/AppHeader.test.ts src/components/AppFooter.test.ts`
Expected: 全部 PASS。

- [ ] **Step 6: Commit**

```bash
git add src/components/AppHeader.vue src/components/AppHeader.test.ts src/components/AppFooter.vue src/components/AppFooter.test.ts
git commit -m "feat: 页头页脚接入产品页入口

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 全量验证与 SSG 产物核对

**Files:**

- 无新改动（只跑校验；若 lint/format 有产出则以 `style:`/`fix:` 提交）

**Interfaces:**

- Consumes: 前四个任务的全部产出。
- Produces: 验证结论（质量门禁全绿 + 双语页面已预渲染 + sitemap 收录）。

- [ ] **Step 1: 质量门禁全量跑一遍**

Run: `mise run format && mise run lint && mise run typecheck && mise run test`
Expected: format 无 diff（`git status --porcelain` 为空）、lint 0 错误、typecheck 通过、测试全绿。若 format/lint 产生修改，以 `style: Prettier/ESLint 格式修正` 提交后重跑。

- [ ] **Step 2: 生产构建并核对 SSG 产物**

Run: `mise run build && ls dist/products/index.html dist/zh/products/index.html && grep -c "/products" dist/sitemap.xml`
Expected: 两个 HTML 文件存在（dirStyle nested）；sitemap 含 `/products` 与 `/zh/products`（grep 计数 ≥ 2）。再抽查 head：`grep -o '<title>[^<]*</title>' dist/products/index.html` 输出 `<title>All Products — MintPop</title>`；`grep -o '<title>[^<]*</title>' dist/zh/products/index.html` 输出 `<title>全部产品 — MintPop</title>`。

- [ ] **Step 3: 本地起 dev server 人工过目（可选但推荐）**

Run: `mise run run`
访问 `http://localhost:5173/products` 与 `/zh/products`：页头有 Products 入口、两张大卡 + SOON 卡、明暗主题切换正常、720px 以下单列。

---

## Self-Review 结论

- **Spec 覆盖**：路由与入口（Task 2/4）、页面结构与三张卡（Task 3）、数据与 i18n（Task 1/3）、测试（Task 3/4 + 契约测试）、SSG/sitemap（Task 5）——spec 各节均有对应任务；「明确不做」清单未被任何任务违反。
- **占位符扫描**：无 TBD/TODO；所有代码块为完整可用内容。
- **类型/命名一致性**：`SHOP_URL`、`'PRODUCTS'`、`products.*` 词条键、`product-card`/`product-card--soon`/`cta`/`products-link` 选择器在各任务间一致。
