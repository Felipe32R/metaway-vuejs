<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter()
const layout = computed(
  () => `${currentRoute.value.meta.layout || "default"}`
)

</script>

<template>
  <component :is="layout">
      <router-view />
  </component>
</template>
