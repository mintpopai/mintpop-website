# 「全部产品」页设计（2026-07-16）

## 目标

为 MintPop 官网新增「全部产品」页，集中展示品牌下的产品线。当前产品两个：**MintPop API**（核心）与 **MintPop Shop**，另加一张「更多产品即将上线」的 SOON 占位卡。单页即终点，不做产品详情子页。

## 路由与入口

- 新路由 `/products`（英文）+ `/zh/products`（中文），route key `PRODUCTS`，加入 `router/index.ts` 的 `BASE_ROUTES`（`zh: true`），两条路由均由 vite-ssg 预渲染。
- **可收录页**：`seo.ts` 增加 `PRODUCTS` 条目（不设 `noindex`），自动获得 canonical、hreflang 与 sitemap 覆盖。
  - EN title：`All Products — MintPop`；description 围绕「MintPop API 与 MintPop Shop 两条产品线」。
  - ZH title：`全部产品 — MintPop`；description 为对应中文。
- 入口两处：
  - 页头：Contact 左侧加 `Products` 链接（样式同 `contact-link`；小屏与 Contact 一同隐藏，由页脚兜底）。
  - 页脚：链接组新增一条指向产品页。

## 页面结构（`src/views/ProductsView.vue`）

沿用 Contact 页骨架：`AppHeader` + `main` + `AppFooter`。页首为左对齐编辑式排版（衬线大标题 h1 + 一段 intro），下方纵向排三个区块：

1. **MintPop API** 大卡（`LIVE` 徽章，复用 SUPPORTED 徽章视觉）
   - 定位句：一个 API 接入文本、视觉与语音，100% 官方满血模型。
   - 要点 ×3：统一端点覆盖全模态／持续纯度验证、绝不混血降配／零数据留存、按用量计费。
   - CTA：`Get Started →`，指向现有 `API_URL`（https://api.mintpop.ai）。
2. **MintPop Shop** 大卡（`LIVE` 徽章）
   - 定位句：主流 AI 订阅一站购齐（ChatGPT Plus、Claude Pro 等）。
   - 要点 ×3：正规渠道直充／下单即时开通／多种支付方式、真人售后。
   - CTA：`Visit Shop →`，指向新增常量 `SHOP_URL`（`src/config/site.ts`，暂定 `https://shop.mintpop.ai`，地址待定可改）。
3. **More coming** SOON 占位卡：复用主页 More 卡的虚线卡样式，无 CTA。

大卡内部布局：左侧文字列（名称 + 徽章 → 定位句 → 要点列表 → CTA），右侧装饰性图形区（延续站内 halftone 波普点阵母题，纯 CSS／内联 SVG，不引任何外部资源，符合全球可达性规范）；小屏（≤720px）图形区隐藏、内容单列堆叠。

## 数据与 i18n

- 文案走 `src/locales/en.ts`（真相源）与 `zh.ts`，新增 `products` 命名空间（页首、两个产品的名称/定位/要点/CTA、SOON 卡文案）；`zh.ts` 由同构类型约束保证词条齐全。
- 产品条目在视图内以结构化数组渲染（名称、徽章、定位、要点、CTA 目标），后续新增产品＝加一段词条＋一个数组项。
- 不建独立数据文件——产品数量少，YAGNI。

## 测试

- `ProductsView.test.ts`（新增）：渲染出两个产品卡与 SOON 卡；CTA href 分别等于 `API_URL` 与 `SHOP_URL`；存在唯一 h1。
- `AppHeader.test.ts`、`AppFooter.test.ts`：补新链接断言（指向本语言树的 `/products`）。
- 结构性测试（`router/index.test.ts`、`seo.test.ts`、`messages.test.ts`）依靠类型约束与遍历断言自动覆盖新条目，如有硬编码路由清单则同步更新。

## 明确不做

- 产品详情子页（`/products/<slug>`）。
- 独立产品数据文件或 CMS。
- 中文自托管 webfont、外链图片等第三方资源。
