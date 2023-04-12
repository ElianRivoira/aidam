import Patient, { PatientDoc, PatientAttrs } from './patient.model';

const getAllPatients = async (): Promise<PatientDoc[]> => {
  const patients = Patient.find();
  return patients;
};

const postPatient = async (data: PatientAttrs): Promise<PatientDoc> => {
  const birthDate = new Date(data.birth);
  const patient = Patient.build({
    ...data,
    birth: birthDate,
  });
  await patient.save();
  return patient;
};

const getOnePatient = async (id: string): Promise<PatientDoc | null> => {
  const patient = await Patient.findOne(
    { _id: id },
    { __v: 0, userId: 0 }
  ).populate({
    path: 'observationsId',
    options: { populate: { path: 'professional' } },
  });
  return patient;
};

const putPatient = async (
  id: string,
  data: object
): Promise<PatientDoc | null> => {
  const patient = await Patient.findByIdAndUpdate(id, data, {
    new: true,
  });
  return patient;
};

const deletePatient = async (id: string): Promise<void> => {
  await Patient.findByIdAndDelete(id);
};

export default {
  getAllPatients,
  postPatient,
  getOnePatient,
  putPatient,
  deletePatient,
};
