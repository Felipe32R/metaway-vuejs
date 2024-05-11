<script setup>
import Button from "@/components/ui/button/Button.vue";
import { localStorageKeys } from "@/config/localStorageKeys";
import { useAuthStore } from "@/stores/AuthStore";
import { LogOut } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import blueLogo from "../assets/images/blueLogo.svg";
import MobileNavigator from "./MobileNavigator.vue";
const router = useRouter();
const authStore = useAuthStore();
const loggedUser = authStore.loggedUser;



const isOpen = ref(false);
const isActive = ref(false);
function handleLogout() {
  localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
  authStore.setToken(null)
  router.push("/login")
}


</script>

<template>
  <MobileNavigator />
  <nav class="hidden md:flex px-10 md:px-20 w-full xl:px-40">
    <ul class="w-full flex justify-left items-center gap-3 h-24 pt-5 mb-8">
      <h2 class="text-indigo-500 mr-10 font-medium">
        <img :src="blueLogo" class="h-6 text-indigo-500" />
      </h2>
      <li>
        <router-link
          :class="'p-2 mr-2 hover:bg-indigo-400 hover:text-white transition-all ease-in rounded-md border-none'"
          :to="'/'"
          >Home</router-link>
        <router-link v-if="loggedUser.tipos === 'ROLE_ADMIN'"
          :class="'p-2 mr-2 hover:bg-indigo-400 hover:text-white transition-all ease-in rounded-md border-none'"
          :to="`/editUser/${loggedUser.id}`"
          >Meu cadastro</router-link>
        <router-link
          :class="'p-2 mr-2 hover:bg-indigo-400 hover:text-white transition-all ease-in rounded-md border-none'"
          :to="'/users'"
          >Usuários</router-link>
        <router-link
          :class="'p-2 mr-2 hover:bg-indigo-400 hover:text-white transition-all ease-in rounded-md border-none'"
          :to="'/persons'"
          >Pessoas</router-link>
        <router-link
          :class="'p-2 mr-2 hover:bg-indigo-400 hover:text-white transition-all ease-in rounded-md border-none'"
          :to="'/contacts'"
          >Contatos</router-link>
      </li>
    </ul>
  </nav>
  <teleport to="body">
    <div
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
      v-if="isOpen"
    >
      <div
        class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px]"
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

  <button
    @click="isOpen = true"
    title="Sair"
    class="hover:bg-red-700 transition-all ease-in border-none absolute right-10 top-8 p-2 rounded-md md:flex items-center justify-center bg-red-500 text-white hidden"
  >
    <LogOut />
  </button>
  <div class="px-5 md:px-20 w-full xl:px-40 mb-6">
    <slot></slot>
  </div>
</template>
