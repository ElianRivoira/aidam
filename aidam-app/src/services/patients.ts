import { api, apiForm, apiFile } from './axiosInstance';

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

export const deletePatient = async (id: string): Promise<Patient> => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};

export const putPatient = async ({
  id,
  form,
}: {
  id: string;
  form: FormData;
}): Promise<Patient> => {
  const response = await apiForm.put(`/patients/${id}`, form);
  return response.data;
};

export const unassignProf = async ({
  id,
  prof,
}: {
  id: string;
  prof: INames;
}): Promise<IunassignProfResponse> => {
  const res = await api.put(`/patients/unassign/${id}`, { profName: prof });
  return res.data;
};

export const searchPatients = async (name: string): Promise<Patient[]> => {
  const res = await api.get(`/patients/search/${name}`);
  return res.data;
};

export const deleteCertificate = async ({
  id,
  fileName,
}: {
  id: string | undefined;
  fileName: string;
}): Promise<void> => {
  if (id) {
    const res = await api.put(`/patients/delete/certificate/${id}`, {
      fileName,
    });
    return res.data;
  }
};
