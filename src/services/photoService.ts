import api from './http';

async function getPhoto(id: number){
  const { data } = await api.get<Blob>(`/foto/download/${id}`,{responseType: "blob"})
  const imgUrl = URL.createObjectURL(data);
  return imgUrl
}

async function createPhoto(formData:any, id?: number){


  if(id){
    const { data } = await api.post<any>(`/foto/upload/${id}`, photo)

  return data
  }else{
    const { data } = await api.post<any>(`/foto/upload/125`, formData, {
      headers:{
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data'
      }
    })
    return data

  }
}
export const photoService = {
  getPhoto,
  createPhoto
}

