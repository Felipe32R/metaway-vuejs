import { Contact } from '@/types/Contact';
import { User } from '@/types/User';
import api from './http';
import { photoService } from './photoService';


async function addFavorite(contact: Contact){
  const response = await api.post(`/favorito/salvar`,contact)
  // await api.delete(`/contato/remover/${contact.id}`)
  
  return response
}
async function removeFavorite(contact: Contact){
  // await api.post(`/contato/salvar`,contact)
  const response = await api.delete(`/favorito/remover/${contact.id}`)
  
  return response
}
async function createContact(contact: Contact, user: User){
  const obj = {
    ...contact,
    usuario: {...user}
  }

  const {data} = await api.post(`/contato/salvar`,obj)
  
  return data
}

async function search(term: string, value: string){
  const {data} = await api.post(`/contato/pesquisar`,{[term]: value})
  
  return data
}
async function deleteContact(id:number){
  const {data} = await api.delete(`/contato/remover/${id}`)
  
  return data
}



async function getContacts(){
  const contactsRespopnse = await api.post<Contact[]>(`/contato/pesquisar/`,{termo: ""})
  const contactsWithPhotos = await Promise.all(
    contactsRespopnse.data.map(async (contact) => {
      const photo = await photoService.getPhoto(contact.pessoa.id);
      return { ...contact, photo };
    })
  );
  return contactsWithPhotos
}
async function filterContacts(term: string = 'nome', value: string = ''){
  const contactsRespopnse = await api.post<Contact[]>(`/contato/pesquisar/`,{[term]: value})
  const contactsWithPhotos = await Promise.all(
    contactsRespopnse.data.map(async (contact) => {
      const photo = await photoService.getPhoto(contact.pessoa.id);
      return { ...contact, photo };
    })
  );
  return contactsWithPhotos
}

async function getFavorites() {
  const favoritesResponse = await api.get<Contact[]>(`/favorito/pesquisar`);
  const favoritesWithPhotos = await Promise.all(
    favoritesResponse.data.map(async (favorite) => {
      const photo = await photoService.getPhoto(favorite.pessoa.id);
     
      return { ...favorite, photo };
    })
  );
  return favoritesWithPhotos;
}

export const contactsService = {
  getContacts,
  getFavorites,
  addFavorite,
  removeFavorite,
  createContact,
  search,
  deleteContact,
  filterContacts
}