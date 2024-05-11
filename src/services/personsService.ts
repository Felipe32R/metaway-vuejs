import { Person } from '@/types/Person';
import api from './http';
import { photoService } from './photoService';

async function getPersons(term: string = 'nome', value: string = ''){
  const personsRespopnse =  await api.post(`/pessoa/pesquisar`,{[term]: value})  
  const personsWithPhotos = await Promise.all(
    personsRespopnse.data.map(async (person: Person) => {
      const photo = await photoService.getPhoto(Number(person.id));
      return { ...person, photo };
    })
  );

  return personsWithPhotos
}

async function getPersonInfo(id: number){
  const {data} =  await api.get(`/pessoa/buscar/${id}`)  
  return data
}

async function createPerson(person: Person){
  const { data } =  await api.post(`/pessoa/salvar`, {...person, foto: {id:'fc58206b-ccfb-4148-a9ad-3767bc80c35b',
    name: 'foto',
    type: 'image/png'
  }})  
  return data
}

async function deletePerson(id:number){
  const {data} = await api.delete(`/pessoa/remover/${id}`)
  
  return data
}

export const personsService = {
  getPersons,
  getPersonInfo,
  createPerson,
  deletePerson
}