<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { Pencil, Search, UserRoundX, X } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { usePersonsController } from "../usePersonsController";
const { listPersons, listPersonsByFilter, filteredPersons, persons, isLoading,deletePerson } = usePersonsController();
const router = useRouter();


const columns = [
  { key: "photo", label: "Foto" },
  { key: "name", label: "Nome" },
  { key: "cpf", label: "CPF" },
  { key: "actions", label: "Ações" },

];
onMounted(() => listPersons());

const selectedFilterType = ref("nome")
const searchTerm = ref("")




watch(searchTerm, (newValue) => {
  if (newValue == '') {
    filteredPersons.value = []
  }
}, { immediate: true });


function filterPersons(){
  listPersonsByFilter(selectedFilterType.value,searchTerm.value)
}
const isDeleteModalOpen = ref(false);

const selectedPerson = ref({});


function handleDelete(){
  deletePerson(selectedPerson.value.id)
  isDeleteModalOpen.value = false
}


</script>

<template>
   <Toaster />
  <!-- Modal excluir -->
  <teleport to="body">
    <div v-if="isDeleteModalOpen" class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25" >
      <div class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px] " >
        <span>Excluir <span class="text-indigo-600 font-medium"> {{ selectedPerson.nome }}</span> ?</span>
        <div class="flex justify-end items-center gap-3" >
          <Button @click="handleDelete">Confirmar</Button>
          <Button @click="isDeleteModalOpen = false" class="bg-red-500 hover:bg-red-700">Cancelar</Button>
        </div>
      </div>      
    </div>
  </teleport>
  
  <div class="flex w-full md:items-center justify-between mb-4 md:flex-row flex-col-reverse gap-3 items-end">
    <div class="flex gap-2 md:gap-10 items-center justify-start w-full max-w-[600px]">
      <div  class="flex items-center w-full" >
        <Input  placeholder="Pesquisar" class="w-400px" v-model="searchTerm" />
        <X @click="searchTerm = ''" v-if="searchTerm" class="ml-[-30px] cursor-pointer" />
      </div>
      <Button @click="filterPersons" :disabled="isLoading || !searchTerm"  class="max-w-20 w-full bg-indigo-500 hover:bg-indigo-400">
        <Search />
      </Button>
    </div>
    <Button class="ml-3" @click="router.push('/editPerson')">Nova pessoa </Button>
  </div>

  <table v-if="!isLoading" class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
  
        <th
          class=" px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          Foto
        </th>
        <th
          class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          Nome
        </th>
        <th
          class="hidden md:block px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          CPF
        </th>
        <th
          class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          Ações
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="person in filteredPersons.length > 0 ? filteredPersons : persons" :key="person.id" class="bg-white  border-b-2 border-gray-200">
        <td class="flex items-center justify-center">
          <img
            :src="person.photo"
            alt="Foto de {{ person.nome }}"
            class="h-9 w-9 rounded-full"
          />
        </td>
        <td>{{ person.nome }}</td>
        <td class="hidden md:table-cell" >{{ person.cpf }}</td>

        <td class="flex items-center gap-2 justify-around" @click="selectedPerson = person">
          <router-link
            :to="`/editPerson/${person.id}`"
            class="flex items-center gap-2 justify-around"
          >
            <Pencil
              title="Editar"
              class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
            />
          </router-link>
          <UserRoundX @click="isDeleteModalOpen = true" title="Excluir" class="cursor-pointer text-red-500 hover:bg-red-500 rounded-md hover:text-white h-10 w-10 p-2 transition duration-200 ease-in-out"/> 
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else >
    <Loader/>
  </div>
</template>
