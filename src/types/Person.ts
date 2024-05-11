import { Address } from "./Address";
import { Photo } from "./Photo";

export interface Person {
  cpf: string;
  endereco: Address;
  foto: Photo;
  id?: number;
  nome: string;
}