<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
</script>

<template>
  <teleport to="body">
    <div
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
    >
      <span class="animate-spin"><LoaderCircle class="h-16 w-16 text-indigo-700"  /></span>
    </div>
  </teleport>
</template>
