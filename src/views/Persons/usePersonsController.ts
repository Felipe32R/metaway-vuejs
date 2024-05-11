import { personsService } from "@/services/personsService";
import { Person } from "@/types/Person";
import { toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";


const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  cpf: z.string().min(1, "CPF é obrigatório."),
  endereco: z.object({
    bairro: z.string().min(1, "Bairro é obrigatório."),
    cep: z.string().min(1, "CEP é obrigatório. ").regex(/^\d{5}-?\d{3}$/, {
      message: 'CEP inválido. O formato correto é "XXXXX-XXX".',
    }),
    cidade: z.string().min(1, "Cidade é obrigatório."),
    estado: z.string().min(1, "Estado é obrigatório."),
    logradouro: z.string().min(1, "Logradouro é obrigatório."),
    numero: z.string().min(1, "Número é obrigatório. ").regex(/^\d+$/, "Deve ser um número."),
    pais: z.string().min(1, "País é obrigatório."),
  }),

});

type FormData = z.infer<typeof schema>;
const errors = ref<z.ZodFormattedError<FormData> | null>(null);

export function usePersonsController() {
  const router = useRouter();
  const persons = ref<Person[]>([]);
  const filteredPersons = ref<Person[]>([]);

  const isLoading = ref(false);

  const listPersons = async () => {
    try {
      isLoading.value = true;
      const personsResponse = await personsService.getPersons();
      persons.value = personsResponse;
      isLoading.value = false;
    } catch (err) {
      toast.error("Erro ao buscar lista de pessoas.");
    }
    isLoading.value = false;
  };
  const listPersonsByFilter = async (term: string, value: string) => {
    try {
      isLoading.value = true;
      const personsResponse = await personsService.getPersons(term, value);
      if(personsResponse.length === 0 ){
      toast.error("Nenhuma pessoa encontrada.");

      }
      filteredPersons.value = personsResponse;

    } catch (err) {
      toast.error("Erro ao filtrar pessoas.");
    }
    isLoading.value = false;
  };


  const handleCreatePerson = async (data: Person, userId?: number) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      errors.value = result.error.format();

    } else {
      isLoading.value = true;
      errors.value = null;

      try {
        
        if(userId){
          await personsService.createPerson({id:userId,...data},);
          toast.success("Usuário editado com sucesso.");
        }else{
          await personsService.createPerson(data);

          toast.success("Pessoa criada com sucesso.");
        }
        setTimeout(() => { isLoading.value = false, router.go(-1)},3500)
        
      } catch (err) {
        toast.error("Erro ao criar pessoa.");
        isLoading.value = false
      }
    }
  };



  const person = ref<Person>();


  const getPerson = async (id: number) => {
    isLoading.value = true;

    try {
      const personResponse = await personsService.getPersonInfo(id);

      person.value = {...personResponse.object, endereco:{...personResponse.object.endereco, numero: String(personResponse.object.endereco.numero)}}
      errors.value = null; 
      isLoading.value = false;
    } catch (err) {
      toast.error("Erro ao buscar pessoa.");
      isLoading.value = false;

    }
  };

  const deletePerson = async (id: number) => {
    isLoading.value = true;

    try {
      await personsService.deletePerson(id);

      listPersons()
  
      toast.success("Pessoa deletado com sucesso!");

    } catch (err) {
      toast.error("Erro ao deletar pessoa.");

    }finally{
      isLoading.value = false;
    }
  };

  return { listPersons,listPersonsByFilter,handleCreatePerson, errors, persons, person, filteredPersons, isLoading, getPerson,deletePerson};
}
