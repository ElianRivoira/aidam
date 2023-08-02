import Patient, { PatientDoc } from '../models/patient.model';

const helperFunction = (num: number, splittedName: string[]) => {
  let returnArray = [];

  for (let i = 0; i < num; i++) {
    returnArray.push({
      $or: [
        { firstName: { $regex: `.*${splittedName[i]}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${splittedName[i]}.*`, $options: 'i' } },
      ],
    });
  }
  returnArray.push({ active: true });

  return returnArray;
};

export const searchPatients = async (
  wordsNumber: number,
  splittedName: string[],
  limit: number,
  page: number,
  count: number
) => {
  count = await Patient.countDocuments({
    $and: helperFunction(wordsNumber, splittedName),
  });
  const findedPatients = await Patient.find({
    $and: helperFunction(wordsNumber, splittedName),
  })
    .populate({
      path: 'observationsId',
      options: { populate: { path: 'professional' } },
    })
    .skip(limit * page)
    .limit(limit)
    .populate({ path: 'professionalsId' })
    .sort({ lastName: 1 });
  return { findedPatients, count };
};
