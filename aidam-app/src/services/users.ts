import { api } from './axiosInstance';

export const postUser = async (data: PostUser): Promise<User>  => {
  const user = await api.post('/users', data);
  return user.data;
}