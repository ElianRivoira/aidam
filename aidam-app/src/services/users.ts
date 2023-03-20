import { api } from './axiosInstance';


export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/users/login', {
    email,
    password,
  });
  return res.data;
}

export const postUser = async (data: PostUser): Promise<User>  => {
  const user = await api.post('/users', data);
  return user.data;
}

