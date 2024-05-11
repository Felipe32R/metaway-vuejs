<script setup lang="ts">
import ErrorMessage from "@/components/ErrorMessage.vue";
import Return from "@/components/Return.vue";
import Button from "@/components/ui/button/Button.vue";
import { Input } from "@/components/ui/input";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { LoaderCircle } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import InputContainer from "@/components/InputContainer.vue";
import Loader from "@/components/Loader.vue";
import { Person } from "@/types/Person";
import { usePersonsController } from "../usePersonsController";
const { handleCreatePerson, errors, isLoading, person, getPerson } =
  usePersonsController();

const router = useRouter();

const personId = router.currentRoute.value.params.id;

onMounted(() => {
  if (personId) {
    getPerson(Number(personId));
  }
});

const form = ref<Person>({
  nome: "",
  cpf: "",
  endereco: {
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    logradouro: "",
    numero: "",
    pais: "",
  },
  foto: {
    name: "",
    type: "",
  },
});

watch(
  person,
  (newValue) => {
    if (newValue) {
      form.value = {
        nome: newValue.nome,
        cpf: newValue.cpf,
        endereco: newValue.endereco,
        foto: newValue.foto,
      };

    }
  },
  { immediate: true }
);

function handleCreate() {
  if (personId) {
    handleCreatePerson(form.value, Number(personId));
  } else {
    handleCreatePerson(form.value);
  }
}
</script>

<template>
  <Toaster />
  <div class="w-full flex items-center justify-center">
    <form
      @submit.prevent="handleCreate"
      class="w-full h-full flex flex-col gap-3 justify-center"
    >
      <div class="flex items-center  md:justify-center justify-end">
        <Return />
        <h1 class="text-indigo-700 font-bold self-center mb-10">
          {{ personId ? "Editar pessoa - " : "Criar pessoa" }} {{ form.nome }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center w-full justify-between">
        <InputContainer label="Nome">
          <Input placeholder="Nome" v-model="form.nome" />
          <ErrorMessage :errors="errors?.nome?._errors" />
        </InputContainer>

        <InputContainer label="CPF">
          <Input
            v-mask="'###.###.###-##'"
            placeholder="CPF"
            v-model="form.cpf"
          />
          <ErrorMessage :errors="errors?.cpf?._errors" />
        </InputContainer>
        <InputContainer label="Bairro">
          <Input placeholder="Bairro" v-model="form.endereco.bairro" />
          <ErrorMessage :errors="errors?.endereco?.bairro?._errors" />
        </InputContainer>
        <InputContainer label="CEP">
          <Input
            v-mask="'#####-###'"
            placeholder="CEP"
            v-model="form.endereco.cep"
          />
          <ErrorMessage :errors="errors?.endereco?.cep?._errors" />
        </InputContainer>
        <InputContainer label="Cidade"> 
          <Input placeholder="Cidade" v-model="form.endereco.cidade" />
          <ErrorMessage :errors="errors?.endereco?.cidade?._errors" />
        </InputContainer>
        <InputContainer label="Estado">
          <Input placeholder="Estado" v-model="form.endereco.estado" />
          <ErrorMessage :errors="errors?.endereco?.estado?._errors" />
        </InputContainer>
        <InputContainer label="Logradouro">
          <Input placeholder="Logradouro" v-model="form.endereco.logradouro" />
          <ErrorMessage :errors="errors?.endereco?.logradouro?._errors" />
        </InputContainer>
        <InputContainer label="Número">
          <Input placeholder="Número" v-model="form.endereco.numero" />
          <ErrorMessage :errors="errors?.endereco?.numero?._errors" />
        </InputContainer>
        <InputContainer label="País">
          <Input placeholder="País" v-model="form.endereco.pais" />
          <ErrorMessage :errors="errors?.endereco?.pais?._errors" />
        </InputContainer>
      </div>

      <Button
        v-if="!isLoading"
        type="submit"
        class="w-40 self-center mt-5 mb-20"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="animate-spin"><LoaderCircle /></span>
        <span v-else>{{
          personId ? "Salvar alterações" : "Criar pessoa"
        }}</span>
      </Button>
      <Loader v-else />
    </form>
  </div>
</template>
