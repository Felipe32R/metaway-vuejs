import { contactsService } from "@/services/contactsService";
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { ref } from 'vue';
import { Contact } from "../../types/Contact";
export function useHomeController() {
  const contacts = ref<Contact[]>([]);
  const favorites = ref<Contact[]>([]);
  const isLoading = ref(false);
  const filteredContacts = ref<Contact[]>([]);

  const listContacts = async () => {
    try {
      isLoading.value = true;
      const [contactsResponse, favoritesResponse] = await Promise.all([
        contactsService.getContacts(),
        contactsService.getFavorites(),
      ]);
      contacts.value = contactsResponse
      favorites.value = favoritesResponse
      isLoading.value = false

    } catch (err) {
      toast.error("Erro ao listar contatos.");
    }
  };
  const createFavorite = async (contact: Contact) => {
    try {
      isLoading.value = true;
      await contactsService.addFavorite(contact)
      listContacts()
      isLoading.value = false
      toast.success(`${contact.pessoa.nome} adicionado(a) aos favoritos.`);

    } catch (err) {
      toast.error("Erro ao adicionar aos favoritos.");
    }
  };
  const removeFromFavorite = async (contact: Contact) => {
    try {
      isLoading.value = true;
      await contactsService.removeFavorite(contact)
      listContacts()
      isLoading.value = false
      toast.success(`${contact.pessoa.nome} removido(a) dos favoritos.`);

    } catch (err) {
      isLoading.value = false
      toast.error("Erro ao remover dos favoritos.");
    }
  };
  

  async function deleteContact(id:number){
    try {
      isLoading.value = true;
      await contactsService.deleteContact(id)
      listContacts()
      isLoading.value = false
      toast.success(`Contato deletado com sucesso.`);

    } catch (err) {
      toast.error("Erro ao deletar contato.");
      isLoading.value = false
    }
  
  }

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



  return { listContacts, contacts, favorites, isLoading,createFavorite,removeFromFavorite,deleteContact,listContactsByFilter, filteredContacts };
}
