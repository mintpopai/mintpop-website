/// <reference types="vite-ssg" />
/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'

import { Locale, localizePath } from './src/config/locale'
import { SEO } from './src/config/seo'
import { INDEXABLE_ROUTES, SITE_URL } from './src/config/site'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// 产物级冒烟守护:vite-ssg 与 unhead 大版本不匹配时,SSG head 会「静默失效」——
// 构建照常成功、产物却缺 title/canonical(见 README 技术栈一节)。typecheck/单测/
// 构建三道门禁都抓不到这种回归,故对预渲染产物直接断言,失效即构建红。
async function assertPrerenderedHeads() {
  for (const locale of [Locale.EN, Locale.ZH]) {
    const pagePath = localizePath('/', locale)
    const file = `dist${pagePath === '/' ? '' : pagePath}/index.html`
    const html = await readFile(file, 'utf8')
    const expectedTitle = `<title>${SEO.HOME.copy[locale].title}</title>`
    const expectedCanonical = `rel="canonical" href="${SITE_URL}${pagePath}"`
    for (const expected of [expectedTitle, expectedCanonical]) {
      if (!html.includes(expected)) {
        throw new Error(`SSG head 冒烟断言失败:${file} 缺少 ${expected} —— head 可能静默失效`)
      }
    }
  }
  console.log('SSG head smoke check passed (en/zh title + canonical)')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 用 @ 指向 src,简化深层引用
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // vite-ssg 预渲染选项
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // nginx 按目录路由(访问 /legal/ 读取 dist/legal/index.html),需嵌套目录结构
    dirStyle: 'nested',
    async onFinished() {
      const body = INDEXABLE_ROUTES.map(
        (path) => `  <url><loc>${SITE_URL}${path}</loc></url>`,
      ).join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
      await writeFile('dist/sitemap.xml', xml)
      console.log('Sitemap written to dist/sitemap.xml')
      await assertPrerenderedHeads()
    },
  },
  // 单元测试(Vitest):测纯逻辑与 composables,故需 jsdom 提供 window/localStorage 等浏览器全局
  test: {
    environment: 'jsdom',
    // jsdom 不实现 matchMedia 等,在 setup 里 stub,避免 useTheme 读取系统偏好时抛错
    setupFiles: ['./vitest.setup.ts'],
  },
})
