<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="flex flex-col items-start relative w-full max-w-xs mb-4">
    <span v-if="label" class="text-sm mb-2">{{ label }}</span>

      <slot></slot>
 
  </div>
</template>
