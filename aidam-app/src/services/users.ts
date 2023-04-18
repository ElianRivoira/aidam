import { api } from './axiosInstance';

export const postUser = async (data: PostUser): Promise<User> => {
  const res = await api.post('/users', data);
  return res.data;
};

export async function login(data: {email: string, password: string}): Promise<User> {
  const res = await api.post('/users/login', data);
  return res.data;
}

export async function getLoggedUser(): Promise<User> {
  const res = await api.get('/users/me');
  return res.data;
}

export async function getAllUsers(): Promise<User[]> {
  const res = await api.get('/users');
  return res.data;
}

export async function registerUser(id: string) {
  const res = await api.put(`/users/register/${id}`);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await api.delete(`/users/${id}`);

export async function searchUser(name: string): Promise<User[]> {
  const res = await api.get(`/users/search/${name}`);
  return res.data;
}
