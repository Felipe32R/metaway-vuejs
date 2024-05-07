import api from './http';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  tipos: string[];
  accessToken: string;
}

type WithoutAccessToken<T>  = Omit<T, 'accessToken'>;

export interface LoggedUser extends WithoutAccessToken<LoginResponse>{}

async function login(params: LoginParams){
  const { data } = await api.post<LoginResponse>('/auth/login', params)
  return data
}

export const authService = {
  login
}