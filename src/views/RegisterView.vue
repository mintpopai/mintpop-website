<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PlaceholderPage from '@/components/PlaceholderPage.vue'
import { useSeo } from '@/composables/useSeo'

useSeo('REGISTER')
const { t } = useI18n()
</script>

<template>
  <PlaceholderPage
    :title="t('placeholder.registerTitle')"
    :description="t('placeholder.registerDesc')"
  />
</template>
