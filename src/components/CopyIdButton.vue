<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

// 嵌在描述句内的「点击复制号码」按钮（QQ 群号、微信号共用）：成功后短暂展示对勾反馈
const props = defineProps<{
  value: string
  label: string
  copiedLabel: string
}>()

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
async function copyValue() {
  try {
    await navigator.clipboard.writeText(props.value)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}
onBeforeUnmount(() => clearTimeout(copiedTimer))
</script>

<template>
  <button
    type="button"
    class="copy-id"
    :class="{ 'copy-id--done': copied }"
    :aria-label="label"
    @click="copyValue"
  >
    {{ value }}
    <svg
      v-if="!copied"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
    <svg
      v-else
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
    <span class="visually-hidden" role="status">
      {{ copied ? copiedLabel : '' }}
    </span>
  </button>
</template>

<style scoped>
/* 号码复制按钮：嵌在描述句内，虚线下划线提示可点，复制成功变对勾 */
.copy-id {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  color: var(--text);
  border-bottom: 1px dashed var(--border2);
  transition: color 0.2s ease;
}

.copy-id:hover {
  color: #12b7f5;
}

/* 双类写法抬高特异性：已复制的绿色反馈要盖过 :hover 蓝 */
.copy-id.copy-id--done {
  color: var(--accent-deep);
}
</style>
