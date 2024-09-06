<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NPopover } from 'naive-ui'
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false
  }
})

const popoverData = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('/api/markdown/href_preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: props.href
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    popoverData.value = data.title || 'No title available'
  } catch (error) {
    console.error('Error fetching data:', error)
    popoverData.value = 'Error loading title'
  }
})
</script>

<template>
  <NPopover trigger="hover">
    <template #trigger>
      <NuxtLink :href="props.href" :target="props.target" class="text-primary underline">
        <slot />
      </NuxtLink>
    </template>
    <span>{{ popoverData || 'No title available' }}</span>
  </NPopover>
</template>
