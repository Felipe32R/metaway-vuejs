import api from './http';



async function getContacts(id: number){
  const { data } = await api.get<any>(`/contato/listar/${id}`)
  return data
}

export const contactsService = {
  getContacts
}