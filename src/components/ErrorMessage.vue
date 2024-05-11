<template>
  <div v-if="errors" class="text-red-500 text-xs mt-2">
    <span v-for="error in errors">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  }
});
</script>