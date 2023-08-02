import { ServerError } from '../errors/server-error';
import INames from '../interfaces/INames';
import { searchPatients } from '../utils/searchPatient';
import Patient, { PatientDoc, PatientAttrs } from './patient.model';

const getAllPatients = async (): Promise<PatientDoc[]> => {
  const patients = Patient.find()
    .sort({ lastName: 1 })
    .populate({
      path: 'observationsId',
      options: { populate: { path: 'professional' } },
    })
    .populate({ path: 'professionalsId' });
  return patients;
};

const getAllPatientsFromTherapist = async (professionalId: string): Promise<PatientDoc[]> => {
  try {
    const patients = await Patient.find({ professionalsId: professionalId }).sort({ lastName: 1 });
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

const getOnePatient = async (id: string, populate?: boolean): Promise<PatientDoc | null> => {
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
  professionalId?: string | null,
  pull?: boolean,
  certificate?: string,
  report?: string,
  medicalReport?: string,
  socialReport?: string
): Promise<PatientDoc | null> => {
  const findAndUpdate = () => {
    if (pull) {
      if (certificate) {
        return Patient.findByIdAndUpdate(
          id,
          {
            ...data,
            $pull: {
              professionalsId: professionalId,
              certificate: certificate,
            },
          },
          {
            new: true,
          }
        );
      } else if (report) {
        return Patient.findByIdAndUpdate(
          id,
          {
            ...data,
            $pull: {
              professionalsId: professionalId,
              reports: report,
            },
          },
          {
            new: true,
          }
        );
      } else if (medicalReport) {
        return Patient.findByIdAndUpdate(
          id,
          {
            ...data,
            $pull: {
              professionalsId: professionalId,
              medicalReports: medicalReport,
            },
          },
          {
            new: true,
          }
        );
      } else if (socialReport) {
        return Patient.findByIdAndUpdate(
          id,
          {
            ...data,
            $pull: {
              professionalsId: professionalId,
              socialReports: socialReport,
            },
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
            $pull: { professionalsId: professionalId },
          },
          {
            new: true,
          }
        );
      }
    } else if (certificate) {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $addToSet: {
            professionalsId: professionalId,
            certificate: certificate,
          },
        },
        {
          new: true,
        }
      );
    } else if (report) {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $addToSet: {
            professionalsId: professionalId,
            reports: report,
          },
        },
        {
          new: true,
        }
      );
    } else if (medicalReport) {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $addToSet: {
            professionalsId: professionalId,
            medicalReports: medicalReport,
          },
        },
        {
          new: true,
        }
      );
    } else if (socialReport) {
      return Patient.findByIdAndUpdate(
        id,
        {
          ...data,
          $addToSet: {
            professionalsId: professionalId,
            socialReports: socialReport,
          },
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
          $addToSet: {
            professionalsId: professionalId,
          },
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
  const patient = await Patient.findByIdAndUpdate(id, { active: false }, { new: true });
  return patient;
};

const searchPatient = async (
  name: string | INames,
  page?: number
): Promise<{ findedPatients: PatientDoc[]; hasMore: boolean }> => {
  let findedPatients: PatientDoc[] = [];
  const limit = 10;
  let count = 0;

  if (name === '*') {
    count = await Patient.countDocuments({ active: true });
    findedPatients = await Patient.find({ active: true })
      .skip(limit * (page ? page : 0))
      .limit(limit)
      .populate({
        path: 'observationsId',
        options: { populate: { path: 'professional' } },
      })
      .populate({ path: 'professionalsId' })
      .sort({ lastName: 1 });
  } else if (typeof name === 'object') {
    const { firstName1, firstName2, lastName1, lastName2, id } = name;
    findedPatients = await Patient.find({
      $and: [
        {
          $and: [
            {
              firstName: {
                $regex: `.*${firstName1}${firstName2 ? ` ${firstName2}` : ''}.*`,
                $options: 'i',
              },
            },
            {
              lastName: {
                $regex: `.*${lastName1}${lastName2 ? ` ${lastName2}` : ''}.*`,
                $options: 'i',
              },
            },
            {
              _id: id,
            },
          ],
        },
        { active: true },
      ],
    })
      .populate({
        path: 'observationsId',
        options: { populate: { path: 'professional' } },
      })
      .populate({ path: 'professionalsId' })
      .sort({ lastName: 1 });
  } else {
    const splittedName = name.split(' ');
    const result = await searchPatients(
      splittedName.length,
      splittedName,
      limit,
      page ? page : 0,
      count
    );
    findedPatients = result.findedPatients;
    count = result.count;
  }
  const hasMore = limit * (page ? page : 0) + limit < count;
  console.log('hasMore', hasMore)
  return { findedPatients, hasMore };
};

export default {
  getAllPatientsFromTherapist,
  getAllPatients,
  postPatient,
  getOnePatient,
  putPatient,
  deletePatient,
  searchPatient,
};
