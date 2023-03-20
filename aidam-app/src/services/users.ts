import { api } from './axiosInstance';

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/users/login', {
    email,
    password,
  });
  return res.data;
}
