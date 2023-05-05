import { api, apiForm } from './axiosInstance';

export const postUser = async (data: PostUser): Promise<User> => {
  const res = await api.post('/users', data);
  return res.data;
};

export async function login(data: {
  email: string;
  password: string;
}): Promise<User> {
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

export async function registerUser(id: string): Promise<User> {
  const res = await api.put(`/users/register/${id}`);
  return res.data;
}

export async function deleteUser(id: string): Promise<User> {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}

export async function searchUser(name: string): Promise<User[]> {
  const res = await api.get(`/users/search/${name}`);
  return res.data;
}

export async function findUserById(id: string): Promise<User> {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function putUser(data: FormData): Promise<User> {
  const res = await apiForm.put(`/users`, data);
  return res.data;
}

export async function unassignPatient(
  id: string,
  patient: INames
): Promise<void> {
  await api.put(`/users/unassign/${id}`, { patientName: patient });
}

export async function forgotPassword(email: string): Promise<string> {
  console.log(email);
  const res = await api.put(`/users/forgot-password`, { email });
  console.log('RES', res.data.message);
  return res.data.message;
}

export async function sendToken(token: string): Promise<TokenResponse> {
  const res = await api.get(`/users/recover-password?token=${token}`);
  return res.data;
}

export async function changePassword(
  email: string,
  password: string
): Promise<string> {
  const res = await api.put(`/users/changePassword`, { email, password });
  return res.data;
}
