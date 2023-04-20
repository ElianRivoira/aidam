import Patient, { PatientDoc, PatientAttrs } from './patient.model';

const getAllPatients = async (): Promise<PatientDoc[]> => {
  const patients = Patient.find()
    .populate({
      path: 'observationsId',
      options: { populate: { path: 'professional' } },
    })
    .populate({ path: 'professionalsId' });
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
    const patient = await Patient.findOne({ _id: id }, { __v: 0, userId: 0 })
      .populate({
        path: 'observationsId',
        options: { populate: { path: 'professional' } },
      })
      .populate({
        path: 'professionalsId',
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
  professionalId?: string,
  pull?: boolean
): Promise<PatientDoc | null> => {
  const findAndUpdate = () => {
    if (pull) {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $pull: { professionalsId: professionalId },
        },
        {
          new: true,
        }
      );
    } else {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $addToSet: { professionalsId: professionalId },
        },
        {
          new: true,
        }
      );
    }
  };
  const patient = await findAndUpdate();
  return patient;
};

const deletePatient = async (id: string): Promise<PatientDoc | null> => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );
  return patient;
};

export default {
  getAllPatientsFromTherapist,
  getAllPatients,
  postPatient,
  getOnePatient,
  putPatient,
  deletePatient,
};
