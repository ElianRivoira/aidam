import { api, apiForm } from './axiosInstance';

export const getOnePatient = async (id: string): Promise<Patient> => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const postPatient = async (form: FormData): Promise<Patient> => {
  const response = await apiForm.post('/patients', form);
  return response.data;
};

export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get('/patients');
  return response.data;
};
