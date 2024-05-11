<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { Pencil, Search, UserRoundX, X } from "lucide-vue-next";
import { onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { useContactsController } from "../useContactsController";
const { listContacts, contacts, isLoading,deleteContact, listContactsByFilter, filteredContacts } = useContactsController();

const router = useRouter();

const selectedFilterType = ref("nome")

const isDeleteModalOpen = ref(false);
const selectedContact = ref({});

const searchTerm = ref("")

watch(searchTerm, (newValue) => {
  if (newValue == '') {
    filteredContacts.value = []
  }
}, { immediate: true });


onMounted(() => listContacts());

const columns = [
  { key: "name", label: "Nome" },
  { key: "contact", label: "Contato" },
  { key: "actions", label: "Ações" },
];

function filterContacts(){
  listContactsByFilter(selectedFilterType.value,searchTerm.value)
}

 function handleDelete(){
  isDeleteModalOpen.value = false;
  deleteContact(selectedContact.value.id)

}

</script>


<template>
  <!-- Modal excluir -->
  <Toaster/>
  <teleport to="body">
    <div v-if="isDeleteModalOpen" class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25" >
      <div class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px]" >
        <span>Excluir <span class="text-indigo-600 font-medium"> {{ selectedContact?.pessoa?.nome }}</span> ?</span>
        <div class="flex justify-end items-center gap-3" >
          <Button @click="handleDelete">Confirmar</Button>
          <Button @click="isDeleteModalOpen = false" class="bg-red-500 hover:bg-red-700">Cancelar</Button>
        </div>
      </div>      
    </div>
  </teleport>

  <div class="flex w-full md:items-center justify-between mb-4 md:flex-row flex-col-reverse gap-3 items-end ">
    <div class="flex gap-3 items-center justify-start w-full max-w-[600px]">
      <div  class="flex items-center w-full" >
        <Input  placeholder="Pesquisar" class="w-400px" v-model="searchTerm" />
        <X @click="searchTerm = ''" v-if="searchTerm" class="ml-[-30px] cursor-pointer" />
      </div>
      <Button @click="filterContacts" :disabled="isLoading || !searchTerm"  class="max-w-20 w-full bg-indigo-500 hover:bg-indigo-400">
        <Search />
      </Button>
    </div>
    <Button class="ml-3  " @click="router.push('/editContact')">Novo contato </Button>
  </div>

  <table class="min-w-full divide-y divide-gray-200" v-if="!isLoading" >
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    
    <tbody>
      <tr  v-for="contact in filteredContacts.length > 0 ? filteredContacts : contacts" :key="contact.id" class="bg-white border-b-2 border-gray-200">

          <td class=" " > {{ contact.pessoa.nome }}</td>
          <td class="max-w-[110px] overflow-hidden overflow-ellipsis " > {{ contact.email || contact.telefone }}</td>
          
         
        
          <td class=" flex items-center gap-2 justify-around"  @click="selectedContact = contact">
            <router-link :to="`/editContact/${contact.email ? contact.email : contact.pessoa.cpf}`" class="flex items-center gap-2 justify-around">
      <Pencil title="Editar" class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"/>
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
