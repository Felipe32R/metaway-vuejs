<script setup lang="ts">
import ErrorMessage from "@/components/ErrorMessage.vue";
import Return from "@/components/Return.vue";
import Button from "@/components/ui/button/Button.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import { Input } from "@/components/ui/input";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { LoaderCircle } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import InputContainer from "@/components/InputContainer.vue";
import Loader from "@/components/Loader.vue";
import { User } from ".././../../types/User";
import { useUsersController } from "../useUsersController";
const { handleCreateUser, errors, isLoading,user, getUser } = useUsersController()
const adminType = ref("ROLE_USER")
const router = useRouter();

const userId = router.currentRoute.value.params.id



onMounted(() => {
  if(userId){
    getUser(Number(userId))
  }
})

const form = ref<User>({
  username: "",
  cpf: "",
  dataNascimento: "",
  email: "",
  nome: "",
  telefone: "",
  password:  "",
  tipos: []
})

watch(user, (newValue) => {
  if (newValue) {
    form.value = {
      username: newValue.usuario.username,
      cpf: newValue.usuario.cpf,
      dataNascimento: newValue.usuario.dataNascimento,
      email: newValue.usuario.email,
      nome: newValue.usuario.nome,
      telefone: newValue.usuario.telefone,
      password: newValue.usuario.password,
      tipos: newValue.tipos[0]
    }

  }
}, { immediate: true });




 function handleCreate(){
  if(userId){
    handleCreateUser(form.value, adminType.value, Number(userId))
  }else{
    handleCreateUser(form.value, adminType.value)

  }
}

</script>


<template>
  <Toaster />
  <div class="w-full  flex items-center justify-center">
    <form @submit.prevent="handleCreate" class=" w-full h-full flex flex-col gap-3 justify-center">
      <div class="flex items-center md:justify-center justify-end">

        <Return/>
        <h1 class="text-indigo-700 font-bold md:self-center mb-10">{{ userId ? 'Editar usuário - ' : 'Criar usuário' }} {{ form?.username }}</h1>
      </div>

      <div class="flex flex-wrap items-center w-full gap-6">
        <InputContainer label="Nome">
          <Input placeholder="Nome" v-model="form.nome"/>
          <ErrorMessage :errors="errors?.nome?._errors"/>
        </InputContainer>
        <InputContainer label="Nome de usuário">
          <Input placeholder="Nome de usuário" v-model="form.username"/>
          <ErrorMessage :errors="errors?.username?._errors"/>
        </InputContainer >
        <InputContainer label="Senha" v-if="!userId">
          <div v-if="!userId" class="relative w-full max-w-sm items-center">
            <Input placeholder="Senha" v-model="form.password" type="password"/>
            <ErrorMessage :errors="errors?.password?._errors"/>
          </div>
        </InputContainer>
        <InputContainer label="E-mail">
          <Input placeholder="E-mail"  v-model="form.email" type="email"/>
          <ErrorMessage :errors="errors?.email?._errors" />
        </InputContainer>
        <InputContainer label="CPF"> 
          <Input  v-mask="'###.###.###-##'" placeholder="CPF"  v-model="form.cpf"/>
          <ErrorMessage :errors="errors?.cpf?._errors" />
        </InputContainer>
        <InputContainer label="Data de nascimento">
          <Input  v-mask="'####-##-##'" placeholder="Data de nascimento"  v-model="form.dataNascimento"/>
          <ErrorMessage :errors="errors?.dataNascimento?._errors" />
        </InputContainer>
        <InputContainer label="Telefone">
          <Input  v-mask="['(##) # ####-####']" placeholder="Telefone"  v-model="form.telefone"/>
          <ErrorMessage :errors="errors?.telefone?._errors" />
        </InputContainer>
        <div class="relative w-full max-w-sm flex items-center gap-2" v-if="!userId" >
          <Checkbox @update:checked="adminType = 'ROLE_ADMIN'"  />
          <span class="text-sm">{{ userId ? 'Administrador' : 'Criar como administrador' }}</span>
        </div>
      </div>



     
        <Button v-if="!isLoading"  type="submit" class="w-40 self-center mt-10" :disabled="isLoading" >
          <span v-if="isLoading"  class="animate-spin"><LoaderCircle/></span>
          <span v-else >{{ userId ? 'Salvar alterações' : 'Criar usuário' }}</span>
        </Button>
        <Loader  v-else/>
    
    </form>
  </div>
</template>
