<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectLabel from "@/components/ui/select/SelectLabel.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { Pencil, Search, Star, StarOff, UserRoundX, X } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useHomeController } from "../useHomeController";

const router = useRouter();
const {
  listContacts,
  contacts,
  favorites,
  isLoading,
  createFavorite,
  removeFromFavorite,
  deleteContact,
  filteredContacts,
  listContactsByFilter,
} = useHomeController();

onMounted(() => listContacts());

const columns = [
  { key: "photo", label: "Foto" },
  { key: "name", label: "Nome" },
  { key: "email", label: "Contato" },
  { key: "actions", label: "Ações" },
];

const isFavoriteModalOpen = ref(false);
const isRemoveFavoriteModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const selectedContact = ref({});

const selectedContactType = ref("default");

const searchTerm = ref("");

watch(
  searchTerm,
  (newValue) => {
    if (newValue == "") {
      filteredContacts.value = [];
    }
  },
  { immediate: true }
);

function handleAddToFavorite() {
  createFavorite(selectedContact.value);
  isFavoriteModalOpen.value = false;
}
function handleRemoveFromFavorite() {
  removeFromFavorite(selectedContact.value);
  isRemoveFavoriteModalOpen.value = false;
}
function handleDelete() {
  deleteContact(selectedContact.value.id);
  isDeleteModalOpen.value = false;
}
function filterContacts() {
  listContactsByFilter("termo", searchTerm.value);
}
</script>

<template>
  <!-- Modal remover dos favoritos -->
  <teleport to="body">
    <div
      v-if="isRemoveFavoriteModalOpen"
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
    >
      <div
        class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px]"
      >
        <span
          >Remover
          <span class="text-indigo-600 font-medium">
            {{ selectedContact.pessoa.nome }}</span
          >
          dos favoritos?</span
        >
        <div class="flex justify-end items-center gap-3">
          <Button @click="handleRemoveFromFavorite">Confirmar</Button>
          <Button
            @click="isRemoveFavoriteModalOpen = false"
            class="bg-red-500 hover:bg-red-700"
            >Cancelar</Button
          >
        </div>
      </div>
    </div>
  </teleport>
  <!-- Modal favoritar -->
  <teleport to="body">
    <div
      v-if="isFavoriteModalOpen"
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
    >
      <div
        class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px]"
      >
        <span
          >Adicionar
          <span class="text-indigo-600 font-medium">
            {{ selectedContact.pessoa.nome }}</span
          >
          aos favoritos?</span
        >
        <div class="flex justify-end items-center gap-3">
          <Button @click="handleAddToFavorite">Confirmar</Button>
          <Button
            @click="isFavoriteModalOpen = false"
            class="bg-red-500 hover:bg-red-700"
            >Cancelar</Button
          >
        </div>
      </div>
    </div>
  </teleport>
  <!-- Modal excluir -->
  <teleport to="body">
    <div
      v-if="isDeleteModalOpen"
      class="top-0 left-0 bottom-0 right-0 w-full h-full flex items-center justify-center fixed bg-black/25"
    >
      <div
        class="py-8 px-4 flex flex-col gap-8 justify-center bg-white rounded-md w-[400px]"
      >
        <span
          >Excluir
          <span class="text-indigo-600 font-medium">
            {{ selectedContact.pessoa.nome }}</span
          >
          ?</span
        >
        <div class="flex justify-end items-center gap-3">
          <Button @click="handleDelete">Confirmar</Button>
          <Button
            @click="isDeleteModalOpen = false"
            class="bg-red-500 hover:bg-red-700"
            >Cancelar</Button
          >
        </div>
      </div>
    </div>
  </teleport>

  <div
    class="flex w-full items-center gap-10 md:justify-start justify-between my-6 md:my-0"
  >
    <Select v-model="selectedContactType" :defaultValue="selectedContactType">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Filtrar" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Contatos</SelectLabel>
          <SelectItem value="default"> Normais </SelectItem>
          <SelectItem value="favorites"> Favoritos </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <h1 class="md:block hidden text-indigo-600 my-6 font-medium text-[18px]">
      {{
        selectedContactType === "default"
          ? "Contatos normais"
          : "Contatos favoritos"
      }}
    </h1>
    <Button class="md:hidden block" @click="router.push('/editContact')"
      >Novo contato
    </Button>
  </div>

  <div
    class="flex-col-reverse md:flex-row flex w-full items-end md:items-center gap-3 justify-between mb-4"
    v-if="selectedContactType === 'default'"
  >
    <div class="flex gap-10 items-center justify-start w-full max-w-[600px]">
      <div class="flex items-center w-full">
        <Input placeholder="Pesquisar" class="w-400px" v-model="searchTerm" />
        <X
          @click="searchTerm = ''"
          v-if="searchTerm"
          class="ml-[-30px] cursor-pointer"
        />
      </div>
      <Button
        @click="filterContacts"
        :disabled="isLoading || !searchTerm"
        class="max-w-20 w-full bg-indigo-500 hover:bg-indigo-400"
      >
        <Search />
      </Button>
    </div>
    <Button class="hidden md:block" @click="router.push('/editContact')"
      >Novo contato
    </Button>
  </div>

  <Toaster />
  <table
    v-if="!isLoading"
    class="min-w-full divide-y divide-gray-200 sm:table hidden"
  >
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-if="selectedContactType === 'favorites'"
        v-for="favorite in favorites"
        :key="favorite.id"
        class="bg-white border-b-2 border-gray-200"
      >
        <td class="flex items-center justify-center">
          <img
            :src="favorite.photo"
            alt="Foto de {{ favorite.pessoa.nome }}"
            class="h-9 w-9 rounded-full"
          />
        </td>
        <td>{{ favorite.pessoa.nome }}</td>
        <td>{{ favorite.email ? favorite.email : favorite.telefone }}</td>

        <td
          @click="selectedContact = favorite"
          class="flex items-center gap-2 justify-around"
        >
          <StarOff
            @click="isRemoveFavoriteModalOpen = true"
            title="Favoritar"
            class="cursor-pointer text-yellow-400 hover:bg-yellow-400 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
          />
          <router-link
            :to="`/editContact/${
              favorite.email ? favorite.email : favorite.pessoa.cpf
            }`"
            class="flex items-center gap-2 justify-around"
          >
            <Pencil
              title="Editar"
              class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
            />
          </router-link>
        </td>
      </tr>
      <tr
        v-else
        v-for="contact in filteredContacts.length > 0
          ? filteredContacts
          : contacts"
        :key="contact.id"
        class="bg-white border-b-2 border-gray-200"
      >
        <td class="flex items-center justify-center">
          <img
            :src="contact.photo"
            alt="Foto de {{ contact.pessoa.nome }}"
            class="h-9 w-9 rounded-full"
          />
        </td>
        <td>{{ contact.pessoa.nome }}</td>
        <td>{{ contact.email ? contact.email : contact.telefone }}</td>

        <td
          @click="selectedContact = contact"
          class="flex items-center gap-2 justify-around"
        >
          <Star
            @click="isFavoriteModalOpen = true"
            title="Favoritar"
            class="cursor-pointer text-yellow-400 hover:bg-yellow-400 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
          />

          <router-link
            :to="`/editContact/${
              contact.email ? contact.email : contact.pessoa.cpf
            }`"
            class="flex items-center gap-2 justify-around"
          >
            <Pencil
              title="Editar"
              class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
            />
          </router-link>
          <UserRoundX
            @click="isDeleteModalOpen = true"
            title="Excluir"
            class="cursor-pointer text-red-500 hover:bg-red-500 rounded-md hover:text-white h-10 w-10 p-2 transition duration-200 ease-in-out"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="selectedContactType === 'favorites'"
    class="sm:hidden flex-col gap-3 flex border-b-2 border-gray-200 mb-2"
    v-for="favorite in favorites"
    :key="favorite.id"
  >
    <div class="flex items-center gap-3">
      <img
        :src="favorite.photo"
        alt="Foto de {{ favorite.pessoa.nome }}"
        class="h-9 w-9 rounded-full"
      />
      <span>{{ favorite.pessoa.nome }}</span>
    </div>
    <span>{{ favorite.email ? favorite.email : favorite.telefone }}</span>
    <div
      @click="selectedContact = favorite"
      class="flex items-center gap-2 justify-around"
    >
      <Star
        @click="isFavoriteModalOpen = true"
        title="Favoritar"
        class="cursor-pointer text-yellow-400 hover:bg-yellow-400 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
      />

      <router-link
        :to="`/editContact/${
          favorite.email ? favorite.email : favorite.pessoa.cpf
        }`"
        class="flex items-center gap-2 justify-around"
      >
        <Pencil
          title="Editar"
          class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
        />
      </router-link>
      <UserRoundX
        @click="isDeleteModalOpen = true"
        title="Excluir"
        class="cursor-pointer text-red-500 hover:bg-red-500 rounded-md hover:text-white h-10 w-10 p-2 transition duration-200 ease-in-out"
      />
    </div>
  </div>
  <div v-else
    class="sm:hidden flex-col gap-3 flex border-b-2 border-gray-200 mb-2"
    v-for="contact in filteredContacts.length > 0 ? filteredContacts : contacts"
    :key="contact.id"
  >
    <div class="flex items-center gap-3">
      <img
        :src="contact.photo"
        alt="Foto de {{ contact.pessoa.nome }}"
        class="h-9 w-9 rounded-full"
      />
      <span>{{ contact.pessoa.nome }}</span>
    </div>
    <span>{{ contact.email ? contact.email : contact.telefone }}</span>
    <div
      @click="selectedContact = contact"
      class="flex items-center gap-2 justify-around"
    >
      <Star
        @click="isFavoriteModalOpen = true"
        title="Favoritar"
        class="cursor-pointer text-yellow-400 hover:bg-yellow-400 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
      />

      <router-link
        :to="`/editContact/${
          contact.email ? contact.email : contact.pessoa.cpf
        }`"
        class="flex items-center gap-2 justify-around"
      >
        <Pencil
          title="Editar"
          class="cursor-pointer text-indigo-500 hover:bg-indigo-500 rounded-md hover:text-white h-10 w-10 p-2 transition-all ease-in-out"
        />
      </router-link>
      <UserRoundX
        @click="isDeleteModalOpen = true"
        title="Excluir"
        class="cursor-pointer text-red-500 hover:bg-red-500 rounded-md hover:text-white h-10 w-10 p-2 transition duration-200 ease-in-out"
      />
    </div>
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
</template>
