<script setup>
import Button from "@/components/ui/button/Button.vue";
import { Pencil } from "lucide-vue-next";
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuthStore } from '../../../stores/AuthStore';
import { useUsersController } from "../useUsersController";
const { listContacts, isLoading } = useUsersController();

const  router  = useRouter()
const authStore = useAuthStore()

defineProps({
  columns:{
    type: Array,
    required: true
  },
  users:{
    type: Array,
    required: true
  }
})

const isDeleteModalOpen = ref(false);

const selectedUser = ref({});

</script>


<template>

  <div class="flex w-ful items-center justify-end"> 

  <Button class="ml-3 mb-3" @click="router.push('/editUser')" >Novo usuário </Button>
</div>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
     
        <th class="hidden md:block px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          Nome
        </th>
        <th class=" px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          Username
        </th>
        <th class="hidden md:block px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          CPF
        </th>
        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider" >
          E-mail
        </th>
        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider" >
         Ações
        </th>
      </tr>
    </thead>
    
    <tbody>
      <tr  v-for="user in users" :key="user.id" class="bg-white  border-b-2 border-gray-200">

          <td class="hidden md:block"> {{ user.nome }}</td>
          <td class="max-w-[130px] overflow-hidden overflow-ellipsis "> {{ user.username }}</td>
          <td class="hidden md:block"  > {{ user.cpf }}</td>
          <td class="max-w-[160px] overflow-hidden overflow-ellipsis "> {{ user.email }}</td>
        
          <td class=" flex items-center gap-2 justify-around">
            <router-link :to="`/editUser/${user.id}`" class="flex items-center gap-2 justify-around">
      <Pencil title="Editar" class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"/>
    </router-link>  
          </td>
      </tr>
     
    </tbody>
  </table>
</template>
