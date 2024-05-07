
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";

import { contactsService } from "@/services/contactsService";
import { useAuthStore } from "../../stores/AuthStore";



export function useHomeController() {
  const authStore = useAuthStore();

  const listContacts = async () => {

    try {
        const res = await contactsService.getContacts(authStore.loggedUser.id)
        console.log("res", res)
      } catch (err) {
        toast.error("Credenciais inválidas.");
      }
    
  };

  return { listContacts };
}
