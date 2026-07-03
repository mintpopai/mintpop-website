<script setup lang="ts">
import PlaceholderPage from '@/components/PlaceholderPage.vue'
import { useSeo } from '@/composables/useSeo'

useSeo('NOT_FOUND')
</script>

<template>
  <PlaceholderPage
    tag="404"
    title="Page not found"
    description="The page you're looking for doesn't exist or has moved."
  />
</template>
