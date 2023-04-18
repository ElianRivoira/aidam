import Patient, { PatientDoc, PatientAttrs } from './patient.model';

const getAllPatients = async (): Promise<PatientDoc[]> => {
  const patients = Patient.find();
  return patients;
};

const getAllPatientsFromTherapist = async (
  professionalId: string
): Promise<PatientDoc[]> => {
  try {
    const patients = await Patient.find({ professionalsId: professionalId });
    return patients;
  } catch (error) {
    console.error(error);
    throw error;
  }
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

const getOnePatient = async (
  id: string,
  populate?: boolean
): Promise<PatientDoc | null> => {
  if (populate) {
    const patient = await Patient.findOne(
      { _id: id },
      { __v: 0, userId: 0 }
    ).populate({
      path: 'observationsId',
      options: { populate: { path: 'professional' } },
    });
    return patient;
  } else {
    const patient = await Patient.findOne({ _id: id }, { __v: 0, userId: 0 });
    return patient;
  }
};

const putPatient = async (
  id: string,
  data?: object,
  therapistId?: string
): Promise<PatientDoc | null> => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      ...data,
      $addToSet: { professionalsId: therapistId },
    },
    {
      new: true,
    }
  );
  return patient;
};

const deletePatient = async (id: string): Promise<void> => {
  await Patient.findByIdAndDelete(id);
};

export default {
  getAllPatientsFromTherapist,
  getAllPatients,
  postPatient,
  getOnePatient,
  putPatient,
  deletePatient,
};
