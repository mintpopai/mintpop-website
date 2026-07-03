import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

// ESLint flat config：Vue3 + TypeScript 标准组合
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // recommended = essential(错误级) + strongly-recommended(可读性) + recommended(最佳实践)全量档
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
)
