import { contactsService } from "@/services/contactsService";
import { personsService } from "@/services/personsService";
import { usersService } from "@/services/usersService";
import { useAuthStore } from "@/stores/AuthStore";
import { Contact } from "@/types/Contact";
import { Person } from "@/types/Person";
import { User } from "@/types/User";
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const schema = z.object({
  tipoContato: z.string().min(1, "Selecione o tipo"),
  email: z.string().optional(),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  tag: z.string().min(1, "Tag é obrigatório."),
  privado: z.boolean(),
  
});

type FormData = z.infer<typeof schema>;
const errors = ref<z.ZodFormattedError<FormData> | null>(null);

export function useContactsController() {
  const router = useRouter();
  const authStore = useAuthStore();
  const loggedUser = authStore.getLoggedUser;

  const contacts = ref<Contact[]>([]);
  const filteredContacts = ref<Contact[]>([]);
  const persons = ref<Person[]>([]);
  const users = ref<User[]>([]);
  const loggedUserInfo = ref<User>()
  const isLoading = ref(false);

  const listPersons = async () => {
    isLoading.value = true;
    try {
      const [personsResponse, usersResponse] = await Promise.all([
        personsService.getPersons(),
        usersService.getUsers(),
      ]);
      persons.value = personsResponse
      users.value = usersResponse
      isLoading.value = false;
    } catch (err) {
      toast.error("Erro ao buscar contatos.");
      isLoading.value = false;
    }


  };
  const getLoggedUser = async () => {
    isLoading.value = true;
    try {
      const loggedUserResponse = await usersService.getUserInfo(loggedUser?.id)
      loggedUserInfo.value = loggedUserResponse.object.usuario
    isLoading.value = false;

    } catch (err) {
      toast.error("Erro ao buscar usuário.");
    isLoading.value = false;

    }

  };

  const listContacts = async () => {
    try {
      isLoading.value = true;
      const contactsResponse = await contactsService.getContacts();
      contacts.value = contactsResponse;
      isLoading.value = false;
      
    } catch (err) {
      toast.error("Erro ao buscar contatos.");
      isLoading.value = false;
    }

  };



  const handleCreateContact = async (data: any, contactId?: number) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      errors.value = result.error.format();

    } else {
      isLoading.value = true;
      errors.value = null;

      try {

        if(contactId){
          await contactsService.createContact({id:contactId,...data}, loggedUserInfo.value);
          toast.success("Contato editado com sucesso.");
          setTimeout(() => { isLoading.value = false, router.go(-1)},3500)

        }else{
          await contactsService.createContact({...data}, loggedUserInfo.value);
          toast.success("Contato criado com sucesso.");
          setTimeout(() => { isLoading.value = false, router.go(-1)},3500)
        }
        
      } catch (err) {
        toast.error("Erro ao criar contato.");
        isLoading.value = false
      }
    }
  };

  const contact = ref<Contact>();

  const getContact = async (email: string) => {
    isLoading.value = true;

    try {
      const contactResponse = await contactsService.search('termo', email);

      contact.value = contactResponse[0]
      errors.value = null;
      isLoading.value = false;
    } catch (err) {
      toast.error("Erro ao buscar usuário.");
      isLoading.value = false;

    }
  };

  const listContactsByFilter = async (term: string, value: string) => {
    try {
      isLoading.value = true;
      const contactsResponse = await contactsService.filterContacts('termo', value);
      if(contactsResponse.length === 0 ){
      toast.error("Nenhuma pessoa encontrada.");

      }
      filteredContacts.value = contactsResponse;

    } catch (err) {
      toast.error("Erro ao filtrar pessoas.");
    }
    isLoading.value = false;
  };


  const deleteContact = async (id: number) => {
    isLoading.value = true;

    try {
      await contactsService.deleteContact(id);
      const newContacts = await contactsService.getContacts()
  
      contacts.value = newContacts
      toast.success("Contato deletado com sucesso!");

    } catch (err) {
      toast.error("Erro ao deletar contato.");

    }finally{
      isLoading.value = false;
    }
  };

  return { listContacts, handleCreateContact, errors, contacts, isLoading,getContact, contact, listPersons, persons, users, getLoggedUser, loggedUserInfo,deleteContact, filteredContacts,listContactsByFilter};
}
