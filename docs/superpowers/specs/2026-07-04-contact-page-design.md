# Contact 联系页设计

日期：2026-07-04
状态：已与用户确认

## 背景与目标

站点目前没有联系页，页头/页脚的「联系我们」指向 `/legal#contact` 占位页。按用户提供的设计图新建独立 Contact 页，并把「联系我们」入口改为跳转该页。

设计图中 Telegram 卡片原有个人账号 `@Mintpop_Jack` + 群链接两行；用户明确要求**去掉个人账号**，卡片只保留「加入 Telegram 群」链接。

## 页面内容（按设计图）

- 大标题 `Contact`（衬线字体，与占位页标题风格一致）+ 一段介绍文案：
  - 英文（照设计图）：`Mintpop is an API access relay and quota-management service for overseas developers and cross-border teams. Reach us through any channel below — we typically reply within one business day.`
  - 中文对应翻译。
- 两张并排卡片（窄屏纵向堆叠）：
  1. **邮件卡片**（绿色底 `--accent-soft` 系）：信封图标 / `EMAIL SUPPORT` 标签 / `support@mintpop.ai`（`mailto:` 链接）/ 说明「Billing, account, credit-limit, and compliance questions.」（中文对应翻译）。
  2. **Telegram 卡片**（白色/表面底）：纸飞机图标 / `TELEGRAM` 标签 / 「Join our Telegram group →」链接，指向 `https://t.me/+NpAwBIWXs8FkMzVh`，`target="_blank" rel="noopener"`。**不出现 `@Mintpop_Jack`**。

## 实现要点

- **视图**：新增 `src/views/ContactView.vue`，懒加载。
- **常量**：Telegram 群链接、支持邮箱放 `src/config/site.ts` 作为站点级常量（`SUPPORT_EMAIL`、`TELEGRAM_GROUP_URL`），与 `CONSOLE_URL` 同类。
- **路由**：`BASE_ROUTES` 加 `{ path: '/contact', name: 'CONTACT', zh: true }`，自动生成 `/zh/contact` 中文树。
- **SEO**：`src/config/seo.ts` 加 `CONTACT` 条目（title/description 中英双份，可收录、随 `INDEXABLE_ROUTES` 进 sitemap）。现有路由↔SEO 契约测试自动覆盖。
- **i18n**：`en.ts` / `zh.ts` 各加 `contact` 段（标题、介绍、两卡片文案）。英文为真相源，中文按结构对齐。
- **入口**：`AppHeader.vue`、`AppFooter.vue` 的「联系我们」由 `` `${lp('/legal')}#contact` `` 改为 `lp('/contact')`；`legalDesc` 等 Legal 占位文案中「联系方式将呈现于此」的表述不动（Legal 页仍是占位）。

## 测试

- 新增 `ContactView` 组件测试：
  - 渲染出 `mailto:support@mintpop.ai` 链接与 `https://t.me/+NpAwBIWXs8FkMzVh` 群链接；
  - 页面内容**不包含** `Mintpop_Jack` 字样（守护「去掉个人账号」的决定）；
  - Telegram 外链带 `rel="noopener"`。
- 既有契约测试（路由↔SEO↔sitemap、locales 结构对齐）无需改动即覆盖新增条目。

## 备选方案（已否决）

- 在 Legal 占位页内加联系区块：改动最小，但与设计图（独立页面、独立导航入口）不符，否决。
