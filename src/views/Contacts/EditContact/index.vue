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
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectLabel from "@/components/ui/select/SelectLabel.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import { personsService } from "@/services/personsService";
import { Contact } from "@/types/Contact";
import { useContactsController } from "../useContactsController";
const {
  handleCreateContact,
  errors,
  isLoading,
  contact,
  getContact,
  getLoggedUser,
  persons,
  listPersons
} = useContactsController();

const router = useRouter();

const contactType = ref("")
const selectedPersonId = ref("")

const contactEmail = router.currentRoute.value.params.email;


onMounted(() => {
  if (contactEmail) {
    getContact(contactEmail);
    getLoggedUser()
  }else{
    listPersons()
    getLoggedUser()
  }

});

const form = ref<Contact>({
  email: "",
  privado: false,
  tag: "",
  tipoContato: "",
  telefone: "",
  pessoa: {},
  usuario: {},
});

watch(
  contact,
  (newValue) => {
    if (newValue) {
      form.value = {
        email: newValue.email,
        pessoa: newValue.pessoa,
        privado: newValue.privado,
        tag: newValue.tag,
        telefone: newValue.telefone,
        tipoContato: newValue.tipoContato,
        usuario: newValue.usuario,
      };
    }
  },
  { immediate: true }
);
const selectedPerson = ref()

async function handleSelectedPersonChange(personId: number){
  const personResponse = await personsService.getPersonInfo(personId)
  selectedPerson.value = personResponse.object
}

watch(selectedPersonId, (newVal) => {
  if (newVal) {
    handleSelectedPersonChange(Number(newVal))
  }
}, { immediate: true })

function handleCreate() {
  if (contactEmail) {
    handleCreateContact(form.value,Number(contact.value.id));
  } else {

    handleCreateContact({...form.value, tipoContato: contactType.value, pessoa: {...selectedPerson.value}});
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
          {{ contactEmail ? "Editar contato - " : "Criar contato" }} {{ form.pessoa.nome }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center w-full gap-6">
        <InputContainer>
        <Select v-model="contactType" :default-value="contact?.tipoContato">
          <SelectTrigger class="w-[320px]">
            <SelectValue placeholder="Tipo do contato" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo do contato</SelectLabel>
              <SelectItem
               :key="'CELULAR'" :value="'CELULAR'"
              >
              Celular
              </SelectItem>
              <SelectItem
               :key="'EMAIL'" :value="'EMAIL'"
              >
              E-mail
              </SelectItem>
              <SelectItem
               :key="'TELEFONE'" :value="'TELEFONE'"
              >
              Telefone
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ErrorMessage :errors="errors?.tipoContato?._errors" />

      </InputContainer >

        <InputContainer  v-if="contactType === 'EMAIL'" label="E-mail">
          <Input placeholder="E-mail" v-model="form.email" type="email"/>
          <ErrorMessage :errors="errors?.email?._errors" />
        </InputContainer>
        <InputContainer   v-if="contactType === 'CELULAR'" label="Celular">
          <Input v-mask="['(##) # ####-####']" placeholder="Celular" v-model="form.telefone" />
          <ErrorMessage :errors="errors?.telefone?._errors" />
        </InputContainer>
        <InputContainer v-if="contactType === 'TELEFONE'" label="Telefone">
          <Input v-mask="['(##) ####-####']"  placeholder="Telefone" v-model="form.telefone" />
          <ErrorMessage :errors="errors?.telefone?._errors" />
        </InputContainer>


        <InputContainer label="Tag" >
          <Input placeholder="Tag" v-model="form.tag" :default-value="contact?.tag" />
          <ErrorMessage :errors="errors?.tag?._errors" />
        </InputContainer>
        <InputContainer  >
        <Select v-model="selectedPersonId" v-if="!contactEmail" >
          <SelectTrigger class="w-[320px]">
            <SelectValue placeholder="Pessoa" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pessoa</SelectLabel>
              <SelectItem
                v-for="person in persons" :key="person.id" :value="String(person.id)"
              >
                {{ person.nome +  ' - ' +  person.cpf}}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ErrorMessage  />
      </InputContainer>

      <InputContainer>
        <div class="flex items-center gap-2" v-if="!contactEmail">
          <Checkbox @update:checked="form.privado = true" v-model="form.privado" :default-checked="form.privado" />
          <span class="text-sm">Privado</span>
        </div>
        <ErrorMessage  />

      </InputContainer>
       
     

      </div>

      <Button
        v-if="!isLoading"
        type="submit"
        class="w-40 self-center mt-10"
        :disabled="isLoading || (!selectedPerson && !contactEmail)"
      >
        <span v-if="isLoading" class="animate-spin"><LoaderCircle /></span>
        <span v-else>{{
          contactEmail ? "Salvar alterações" : "Criar contato"
        }}</span>
      </Button>
      <Loader v-else />
    </form>
  </div>
</template>
