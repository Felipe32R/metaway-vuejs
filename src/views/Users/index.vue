<script setup lang="ts">

import Loader from "@/components/Loader.vue";
import { onMounted } from "vue";
import UsersTable from "./components/UsersTable.vue";
import { useUsersController } from "./useUsersController";
const { listUsers, users, isLoading } = useUsersController();

onMounted(() => listUsers());


const columns = [
  { key: "name", label: "Nome" },
  { key: "username", label: "Username" },
  { key: "cpf", label: "CPF" },
  { key: "email", label: "E-mail" },
];

</script>

<template>
  
  <div v-if="!isLoading" class="pb-24">
    <UsersTable :columns="columns" :users="users" />
  </div>
  <div v-else>
    <Loader/>
  </div>
</template>