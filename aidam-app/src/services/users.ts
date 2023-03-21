import { api } from './axiosInstance';

export const postUser = async (data: PostUser): Promise<User>  => {
  const res = await api.post('/users', data);
  return res.data;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/users/login', {
    email,
    password,
  });
  return res.data;
}

export async function getLoggedUser(): Promise<User> {
  const res = await api.get('/users/me');
  return res.data;
}
