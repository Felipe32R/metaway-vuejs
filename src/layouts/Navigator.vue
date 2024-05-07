<script setup>
import Button from "@/components/ui/button/Button.vue";
import { localStorageKeys } from "@/config/localStorageKeys";
import { LogOut } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const routes = [
  { name: "Home", redirect: "/" },
  { name: "Meu cadastro", redirect: "/me" },
  { name: "Usuários", redirect: "/users" },
  { name: "Pessoas", redirect: "/personas" },
  { name: "Contatos", redirect: "/contacts" },
];

  const isOpen = ref(false);
  const isActive = ref(false);
  function handleLogout(){
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN)
    setTimeout(() => 2000, router.push("/login"))
  }

  console.log("current", router.currentRoute.value.fullPath)


</script>

<template>
  <ul class="w-full flex justify-left items-center gap-3 h-24 px-10">
    <h2 class="text-slate-500 mr-10">Agenda Pessoal</h2>
    <li v-for="route in routes" :key="route.name">
      <router-link
      :class="[
    'p-2 hover:bg-slate-400 hover:text-white transition-all ease-in rounded-md border-none',
    isActive && 'bg-slate-500'
  ]"

        :to="route.redirect"
        >{{ route.name }}</router-link
      >
    </li>
  </ul>

  <teleport to="body">
    <div class="top-0 left-0 w-full h-full flex items-center justify-center absolute bg-black/25" v-if="isOpen">
      <div class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-80" >
        <span>Deseja mesmo sair?</span>
        <div class="flex justify-end items-center gap-3" >
          <Button @click="handleLogout" >Confirmar</Button>
          <Button @click="isOpen = false" class="bg-red-500 hover:bg-red-700">Cancelar</Button>
        </div>
      </div>      
    </div>

  </teleport>

  <button @click="isOpen = true" title="Sair" class=" hover:bg-red-700 transition-all ease-in border-none  absolute right-10 top-8 p-2 rounded-md flex items-center justify-center bg-red-500 text-white">
    <LogOut />

  </button>
  <slot></slot>
</template>
