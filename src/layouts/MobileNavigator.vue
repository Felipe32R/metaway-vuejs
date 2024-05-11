<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { localStorageKeys } from "@/config/localStorageKeys";
import { useAuthStore } from "@/stores/AuthStore";
import { Menu, X } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from '../assets/images/logo.svg';
const router = useRouter();
const authStore = useAuthStore();
const loggedUser = authStore.loggedUser;


const isOpen = ref(false);
const isMenuOpen = ref(false);

function handleLogout() {
  localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
  authStore.setToken(null)
  router.push("/login")
}


</script>

<template>
  <nav class="md:hidden block w-full transition-all bg-indigo-500 text-white mb-6">
    <div
      class="flex justify-between items-center w-full h-16 bg-green-main md:px-4 px-8 mb-3 py-4"
    >
    <h2 class="text-white mr-10 font-medium">
      <img :src="logo" class="h-5">
    </h2>
      <div v-if="!isMenuOpen">
        <Menu @click="isMenuOpen = !isMenuOpen" class="h-8 w-8" />
      </div>

      <div v-else>
        <X @click="isMenuOpen = !isMenuOpen" class="h-8 w-8"/>
      </div>
    </div>

    <ul v-if="isMenuOpen" class=" flex items-center justify-center gap-3 flex-col w-full  transition-all bg-indigo-500 text-white">

      <li class="w-[200px] rounded-md bg-indigo-400 flex justify-center" >
        <router-link
          :class="'py-2  px-5 transition-all ease-in rounded-md border-none'"
          :to="'/'"
          >Home</router-link>
      </li>
      <li v-if="loggedUser.tipos === 'ROLE_ADMIN'" class="w-[200px] rounded-md bg-indigo-400 flex justify-center" >
        <router-link 
          :class="'py-2  px-5 transition-all ease-in rounded-md border-none'"
          :to="`/editUser/${loggedUser.id}`"
          >Meu cadastro</router-link>
      </li>
      <li class="w-[200px] rounded-md bg-indigo-400 flex justify-center">
        <router-link
          :class="'py-2  px-5 transition-all ease-in rounded-md border-none'"
          :to="'/users'"
          >Usuários</router-link>
      </li>
      <li class="w-[200px] rounded-md bg-indigo-400 flex justify-center">
        <router-link
          :class="'py-2  px-5 transition-all ease-in rounded-md border-none'"
          :to="'/persons'"
          >Pessoas</router-link>
      </li>
      <li class="w-[200px] rounded-md bg-indigo-400 flex justify-center">
        <router-link
          :class="'py-2  px-5 transition-all ease-in rounded-md border-none'"
          :to="'/contacts'"
          >Contatos</router-link>
      </li>
  
      <button @click="isOpen = true" title="Sair" class="py-2 w-[200px] rounded-md bg-red-500 flex justify-center my-4">
        Sair
      </button>
    </ul>
  </nav>

  <teleport to="body">
    <div
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
      v-if="isOpen"
    >
      <div
        class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-80"
      >
        <span>Deseja mesmo sair?</span>
        <div class="flex justify-end items-center gap-3">
          <Button @click="handleLogout">Confirmar</Button>
          <Button @click="isOpen = false" class="bg-red-500 hover:bg-red-700"
            >Cancelar</Button
          >
        </div>
      </div>
    </div>
  </teleport>


</template>
