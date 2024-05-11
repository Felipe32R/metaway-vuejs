export interface User {
  cpf: string;
  dataNascimento: string;
  email: string;
  id?: number;
  nome: string;
  password: string;
  telefone: string;
  username: string;
  tipos?: string[];
}