import { Person } from "./Person";
import { User } from "./User";

export interface Contact {
  email: string;
  id?: number;
  pessoa: Person;
  privado: boolean;
  tag: string;
  telefone: string;
  tipoContato: string;
  usuario: User;
}