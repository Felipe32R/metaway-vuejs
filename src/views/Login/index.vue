<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import { Input } from "@/components/ui/input";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { Eye, EyeOff, LoaderCircle } from "lucide-vue-next";
import { ref } from "vue";
import ErrorMessage from '../../components/ErrorMessage.vue';
import { localStorageKeys } from '../../config/localStorageKeys';
import { useLoginController } from './useLoginController';
const { handleSubmit, errors } = useLoginController()

interface Credentials {
  username: string;
  rememberMe: boolean;
}

const userCredentials = localStorage.getItem(localStorageKeys.USER_CREDENTIALS);
const savedCredentials: Credentials = userCredentials ? JSON.parse(userCredentials) : null;

const isPasswordVisible = ref(false);
const isLoading = ref(false);
const rememberMe = ref(savedCredentials?.rememberMe || false);

console.log("usercredentials", userCredentials)
console.log("savedcredentials", savedCredentials)
console.log("rememberMe", rememberMe)

const form = ref({
  username:  savedCredentials?.username || "",
  password: ""
})

function saveCredentials() {
if(rememberMe.value){
  const credentialsToSave = {
    username: form.value?.username || '',
    rememberMe: rememberMe.value
  }
  localStorage.setItem(localStorageKeys.USER_CREDENTIALS, JSON.stringify(credentialsToSave))
}else{
  const credentialsToSave = {
    username: '',
    rememberMe: rememberMe.value
  }
  localStorage.setItem(localStorageKeys.USER_CREDENTIALS, JSON.stringify(credentialsToSave))
}

}
async function handleLogin() {
  isLoading.value = true
  saveCredentials()
  await handleSubmit(form.value)
  isLoading.value = false
}



</script>


<template>
  <Toaster />
  <div class="w-full h-screen flex items-center justify-center">
    <form @submit.prevent="handleLogin" class="max-w-80 w-full h-full flex flex-col gap-3 justify-center">
      <h1 class="text-slate-700 font-bold self-center mb-10">Agenda Pessoal</h1>

      <Input placeholder="Usuário" v-model="form.username"/>
      <ErrorMessage :errors="errors?.username?._errors"/>

      <div class="relative w-full max-w-sm items-center">
        <Input placeholder="Senha" :type="isPasswordVisible ? 'text' : 'password'" v-model="form.password" />
        <ErrorMessage :errors="errors?.password?._errors" class="mt-2"/>

        <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
          <EyeOff @click="isPasswordVisible = !isPasswordVisible" v-if="isPasswordVisible"
            class="size-6 hover:cursor-pointer" color="#334155" />
          <Eye @click="isPasswordVisible = !isPasswordVisible" v-else class="size-6 hover:cursor-pointer"
            color="#334155" />
        </span>
      </div>

      <div class="flex gap-2 items-center justify-end">
        <Checkbox @update:checked="rememberMe = !rememberMe"  :default-checked="rememberMe" />
        <span class="text-sm">Lembrar credenciais</span>
      </div>

      <Button type="submit" class="w-40 self-center mt-10" :disabled="isLoading" >
        <span v-if="isLoading" class="animate-spin"><LoaderCircle/></span>
        <span v-else>Login</span>
      </Button>
    </form>
  </div>
</template>
