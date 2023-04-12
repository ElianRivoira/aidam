import { Request, Response, NextFunction } from 'express';
import patientService from '../../models/patient-service';

const httpAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).send(patients);
  } catch (e) {
    next(e);
  }
};

const httpPostPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patient = await patientService.postPatient({
      name: req.body.name,
      diagnosis: req.body.diagnosis,
      authorizedModule: req.body.authorizedModule,
      socialwork: req.body.socialwork,
      affiliateNumber: req.body.affiliateNumber,
      dni: req.body.dni,
      birth: req.body.birth,
      email: req.body.email,
      phone: req.body.phone,
    });
    res.status(201).send(patient);
  } catch (e) {
    next(e);
  }
};

const httpGetOnePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    } = req.body;
    const editedPatient = await patientService.putPatient(req.params.id, {
      name,
      diagnosis,
      socialwork,
      affiliateNumber,
      dni,
      birth,
      email,
      phone,
    });
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
  try {
    await patientService.deletePatient(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export {
  httpAllPatients,
  httpPostPatient,
  httpGetOnePatient,
  httpEditPatient,
  httpDeletePatient,
};
