import { api } from './axiosInstance';

export const postObservation = async (
  data: PostObservation
): Promise<Observation> => {
  const obs = await api.post('/observations', data);
  return obs.data;
};

export const getObservation = async (id: string): Promise<Observation> => {
  const obs = await api.get(`/observations/${id}`);
  return obs.data;
};

export const putObservation = async (
  data: PutObservation
): Promise<Observation> => {
  const { id, text, patientId } = data;
  const obs = await api.put(`/observations/edit/${id}`, { text, patientId });
  return obs.data;
};

export const deleteObservation = async (data: DeleteObservation): Promise<void> => {
  const { patientId, obsId } = data;
  const obs = await api.delete(`/observations/${patientId}/delete/${obsId}`);
  return obs.data;
};
