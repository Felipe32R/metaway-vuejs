import { localStorageKeys } from "@/config/localStorageKeys";
import { LoginParams, authService } from "@/services/authService";
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";
import { useAuthStore } from "../../stores/AuthStore";

const schema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório. "),
  password: z.string().min(1, "Senha é obrigatória."),
});

type FormData = z.infer<typeof schema>;
const errors = ref<z.ZodFormattedError<FormData> | null>(null);

export function useLoginController() {
  const { login } = authService;
  const authStore = useAuthStore();
  const router = useRouter();
  const handleSubmit = async (data: LoginParams) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      1;
      errors.value = result.error.format();
    } else {
      errors.value = null;

      try {
        const { accessToken, id, tipos, username } = await login(data);
        const user = { id, tipos, username};

        localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
        authStore.setToken(accessToken);
        authStore.setLoggedUser(user)
        authStore.setSignedIn(true);
        router.push("/");
      } catch (err) {
        toast.error("Credenciais inválidas.");
      }
    }
  };

  return { handleSubmit, errors, schema };
}
