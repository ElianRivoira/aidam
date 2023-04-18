import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import patientService from '../../models/patient-service';
import userService from '../../models/user-service';
import { RequestValidationError } from '../../errors/request-validation-error';
import { BadRequestError } from '../../errors/bad-request-error';

const httpGetAllPatientsFromTherapist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const patients = await patientService.getAllPatientsFromTherapist(
      req.params.id
    );
    res.status(200).send(patients);
  } catch (e) {
    next(e);
  }
};

const httpGetAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).send(patients);
  } catch (e) {
    next(e);
  }
};

const httpPostPatient = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { professionals } = req.body;
    const professionalsArray = JSON.parse(professionals);

    const patient = await patientService.postPatient({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      diagnosis: req.body.diagnosis,
      authorizedModule: req.body.authorizedModule,
      socialwork: req.body.socialwork,
      affiliateNumber: req.body.affiliateNumber,
      dni: req.body.dni,
      birth: req.body.birth,
      email: req.body.email,
      phone: req.body.phone,
    });

    professionalsArray.forEach(async (prof: string) => {
      const findedProf = await userService.searchUser(prof);
      await patientService.putPatient(
        patient._id,
        undefined,
        findedProf[0]._id
      );
    });

    res.status(201).send(patient);
  } catch (e) {
    console.error(e);
    // throw new BadRequestError('error')
  }
};

const httpGetOnePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const patient = await patientService.getOnePatient(req.params.id, true);
    res.status(200).send(patient);
  } catch (e) {
    next(e);
  }
};

const httpEditPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const {
      name,
      diagnosis,
      socialwork,
      affiliateNumber,
      dni,
      birth,
      email,
      phone,
      therapistId,
    } = req.body;
    const editedPatient = await patientService.putPatient(
      req.params.id,
      {
        name,
        diagnosis,
        socialwork,
        affiliateNumber,
        dni,
        birth,
        email,
        phone,
      },
      therapistId
    );
    res.send(editedPatient);
  } catch (e) {
    next(e);
  }
};

const httpDeletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const patient = await patientService.deletePatient(req.params.id);
    res.status(200).send(patient);
  } catch (e) {
    next(e);
  }
};

export {
  httpGetAllPatientsFromTherapist,
  httpGetAllPatients,
  httpPostPatient,
  httpGetOnePatient,
  httpEditPatient,
  httpDeletePatient,
};
