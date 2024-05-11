import { usersService } from "@/services/usersService";
import { User } from "@/types/User";
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

function mascaraData(data: string) {
  return data.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
}

function validatePhoneNumber(phoneNumber: string | null) {
  if (phoneNumber == null) return true;
  // Remove caracteres não numéricos do telefone
  phoneNumber = phoneNumber.replace(/[^\d]+/g, "");
  // Verifica se o telefone possui 10 dígitos
  return /^(\d{10,11})$/.test(phoneNumber);
}

function isCPFValid(cpf: string) {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  cpf = cpf.split("").map((el) => +el);
  const rest = (count) =>
    ((cpf
      .slice(0, count - 12)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;
  return rest(10) === cpf[9] && rest(11) === cpf[10];
}

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório. "),
  username: z.string().min(1, "Nome de usuário é obrigatório. "),
  password: z
    .string()
    .min(1, "Senha é obrigatória. ")
    .min(8, "Digite no mínimo 8 caracteres. ")
    .refine((password) => {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      return hasLetter && hasNumber;
    }, "A senha deve conter letras e números."),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório. ")
    .refine((value) => isCPFValid(value), { message: "CPF inválido." }),
  dataNascimento: z.string().min(1, "Data é obrigatória. ").refine((data) => {
    const dataSemMascara = mascaraData(data);
    const regexData = /^\d{4}-\d{2}-\d{2}$/; // Alterada a regex para aceitar "-" ao invés de "/"
    return regexData.test(data) && dataSemMascara.length === 8;
  },{message: "Utilize o formato AAA-MM-dd"}),
  email: z.string().min(1, "E-mail é obrigatório. ").email("E-mail inválido."),
  telefone: z
    .string()
    .min(1, "Número de telefone é obrigatório. ")
    .refine((value) => validatePhoneNumber(value), {
      message: "Número inválido.",
    }),
});

type FormData = z.infer<typeof schema>;
const errors = ref<z.ZodFormattedError<FormData> | null>(null);

export function useUsersController() {
  const router = useRouter();
  const users = ref<User[]>([]);

  const isLoading = ref(false);

  const listUsers = async () => {
    try {
      isLoading.value = true;
      const [usersResponse] = await Promise.all([usersService.getUsers()]);
      users.value = usersResponse;

    } catch (err) {
      toast.error("Credenciais inválidas.");
    }
    isLoading.value = false;

  };

  const handleCreateUser = async (data: User, adminType: string, userId?: number) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      errors.value = result.error.format();

    } else {
      isLoading.value = true;
      errors.value = null;
      const tipos = [adminType];

      try {
        
        if(userId){
          await usersService.createUser({id:userId,...data}, tipos);
          toast.success("Usuário editado com sucesso.");
        }else{
          await usersService.createUser(data, tipos);

          toast.success("Usuário criado com sucesso.");
        }
        setTimeout(() => { isLoading.value = false, router.go(-1)},3500)
        
      } catch (err) {
        toast.error("Erro ao criar usuário.");
        isLoading.value = false
      }
    }
  };

  const user = ref<User>();

  const getUser = async (id: number) => {
    isLoading.value = true;

    try {
      const userResponse = await usersService.getUserInfo(id);

      user.value = userResponse.object
      errors.value = null;
      isLoading.value = false;
    } catch (err) {
      toast.error("Erro ao buscar usuário.");
      isLoading.value = false;

    }
  };

  return { listUsers, handleCreateUser, errors, users, isLoading,getUser, user};
}
