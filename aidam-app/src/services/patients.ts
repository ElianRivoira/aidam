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

export const searchPatients = async (name: string, page: number): Promise<{findedPatients: Patient[], hasMore: boolean}> => {
  const res = await api.get(`/patients/search/${name}/${page}`);
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

export const uploadReport = async ({
  id,
  form,
}: {
  id: string;
  form: FormData;
}): Promise<Patient> => {
  const res = await apiForm.put(`/patients/uploadReport/${id}`, form);
  return res.data;
};

export const uploadMedicalReport = async ({
  id,
  form,
}: {
  id: string;
  form: FormData;
}): Promise<Patient> => {
  const res = await apiForm.put(`/patients/uploadReport/medical/${id}`, form);
  return res.data;
};

export const uploadSocialReport = async ({
  id,
  form,
}: {
  id: string;
  form: FormData;
}): Promise<Patient> => {
  const res = await apiForm.put(`/patients/uploadReport/social/${id}`, form);
  return res.data;
};

export const deleteReport = async ({
  id,
  fileName,
}: {
  id: string | undefined;
  fileName: string;
}): Promise<void> => {
  if (id) {
    const res = await api.put(`/patients/delete/report/${id}`, {
      fileName,
    });
    return res.data;
  }
};

export const deleteMedicalReport = async ({
  id,
  fileName,
}: {
  id: string | undefined;
  fileName: string;
}): Promise<void> => {
  if (id) {
    const res = await api.put(`/patients/delete/report/medical/${id}`, {
      fileName,
    });
    return res.data;
  }
};

export const deleteSocialReport = async ({
  id,
  fileName,
}: {
  id: string | undefined;
  fileName: string;
}): Promise<void> => {
  if (id) {
    const res = await api.put(`/patients/delete/report/social/${id}`, {
      fileName,
    });
    return res.data;
  }
};