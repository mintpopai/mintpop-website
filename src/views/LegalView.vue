<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PlaceholderPage from '@/components/PlaceholderPage.vue'
import { useSeo } from '@/composables/useSeo'

useSeo('LEGAL')
const { t } = useI18n()
</script>

<template>
  <PlaceholderPage :title="t('placeholder.legalTitle')" :description="t('placeholder.legalDesc')" />
</template>
