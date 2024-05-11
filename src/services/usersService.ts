import { User } from '@/types/User';
import api from './http';

async function getUserInfo(id: number){
  const {data} =  await api.get(`/usuario/buscar/${id}`)  
  return data
}
async function getUsers(){
  const { data } =  await api.post(`/usuario/pesquisar`,{termo: ""})  
  return data
}
async function createUser(user: User, tipos?: string[]){
  const { data } =  await api.post(`/usuario/salvar`,{tipos: tipos, usuario: user})  
  return data
}
async function updateLoggedUser(user: User){
  const { data } =  await api.put(`/usuario/atualizar`, user)  
  return data
}


export const usersService = {
  getUserInfo,
  getUsers,
  createUser,
  updateLoggedUser
}