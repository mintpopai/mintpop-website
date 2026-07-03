<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { readLocalePreference } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { Locale, localeSwitchTarget } from '@/config/locale'

const { syncTheme } = useTheme()
const router = useRouter()
const route = useRoute()

// onMounted 仅在客户端执行，SSR/SSG 预渲染阶段不触发。
// 1）主题：水合期保持 LIGHT 与预渲染一致，挂载后再同步真实主题，消除 hydration mismatch。
// 2）语言偏好回跳：回访用户若打开的是另一语言页，带回偏好语言的对等页。
//    首访无偏好不动作；目标解析不到命名路由（catch-all 404）也不动作，避免跳进 404。
onMounted(() => {
  syncTheme()
  const preferred = readLocalePreference()
  const current = route.meta.locale ?? Locale.EN
  if (!preferred || preferred === current) {
    return
  }
  const target = localeSwitchTarget(route.path, route.hash, preferred)
  if (router.resolve(target).name) {
    void router.replace(target)
  }
})
</script>

<template>
  <RouterView />
</template>
