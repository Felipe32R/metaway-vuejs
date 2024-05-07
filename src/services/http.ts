import axios from "axios";
import { useAuthStore } from '../stores/AuthStore';

const authStore = useAuthStore();

const api = axios.create({
  baseURL: 'https://demometaway.vps-kinghost.net:8485/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = authStore.getToken; 
    console.log("REQUEST", token, authStore.isSignedIn)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho da requisição
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;