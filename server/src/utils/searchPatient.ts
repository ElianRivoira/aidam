import Patient, { PatientDoc } from '../models/patient.model';

export const searchPatients = async (wordsNumber: number, splittedName: string[]) => {
  let findedPatients: PatientDoc[];
  switch (wordsNumber) {
    case 1:
      findedPatients = await Patient.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
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
      return findedPatients;
      break;
    case 2:
      findedPatients = await Patient.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
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
      return findedPatients;
      break;
    case 3:
      findedPatients = await Patient.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
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
      return findedPatients;
      break;
    case 4:
      findedPatients = await Patient.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[3]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[3]}.*`, $options: 'i' } },
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
      return findedPatients;
      break;
    default:
      findedPatients = await Patient.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
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
      return findedPatients;
      break;
  }
};
