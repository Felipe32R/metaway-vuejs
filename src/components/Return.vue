<script setup lang="ts">
import { Undo2 } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <button
    @click="router.go(-1)"
    title="Sair"
    type="button"
    class="hover:bg-indigo-700 transition-all ease-in border-none self-start  p-2 rounded-md flex items-center justify-center bg-indigo-500 text-white absolute md:left-[68px] left-[20px]"
  >
    <Undo2 /> 
  </button>
</template>
