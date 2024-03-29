import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';

import patientService from '../../models/patient-service';
import userService from '../../models/user-service';
import { RequestValidationError } from '../../errors/request-validation-error';
import INames from '../../interfaces/INames';
import { ServerError } from '../../errors/server-error';
import path from 'path';
import { validateToken } from '../../utils/tokens';
import { BadRequestError } from '../../errors/bad-request-error';

import dotenv from 'dotenv';
import { performTask } from '../../services/taskMetric';
dotenv.config();

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
    const patients = await patientService.getAllPatientsFromTherapist(req.params.id);
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

const httpPostPatient = async (req: any, res: Response): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { professionals } = req.body;
    const professionalsArray = JSON.parse(professionals);

    const firstName = req.body.firstName.trim().replace(/\s+/g, ' ').toUpperCase();
    const lastName = req.body.lastName.trim().replace(/\s+/g, ' ').toUpperCase();

    const patient = await patientService.postPatient({
      firstName: firstName,
      lastName: lastName,
      diagnosis: req.body.diagnosis,
      authorizedModule: req.body.authorizedModule,
      socialwork: req.body.socialwork,
      affiliateNumber: req.body.affiliateNumber,
      dni: req.body.dni,
      birth: req.body.birth,
      email: req.body.email,
      phone: req.body.phone,
      cud: req.body.cud,
      adress: req.body.adress,
      certificate: req.file && [req.file.filename],
      school: req.body.school,
      shift: req.body.shift,
      schoolYear: req.body.schoolYear,
    });

    professionalsArray.forEach(async (prof: string) => {
      const findedProf = await userService.searchUser(prof);
      await userService.putUser(findedProf[0]._id, undefined, patient._id);
      await patientService.putPatient(patient._id, undefined, findedProf[0]._id);
    });

    res.status(201).send(patient);
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
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
    throw new ServerError(e);
  }
};

const httpEditPatient = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const {
      firstName,
      lastName,
      diagnosis,
      socialwork,
      affiliateNumber,
      authorizedModule,
      dni,
      birth,
      email,
      phone,
      adress,
      cud,
      professionals,
      school,
      shift,
      schoolYear,
    } = req.body;
    const filename = req.file && req.file.filename;

    const { user } = validateToken(req.session.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (!loggedUser.patientsId.includes(req.params.id) && loggedUser.admin === false)
        throw new BadRequestError('No posee permisos para editar este paciente');
    }

    const trimedFirstName = firstName.trim().replace(/\s+/g, ' ').toUpperCase();
    const trimedLastName = lastName.trim().replace(/\s+/g, ' ').toUpperCase();

    const editedPatient = await patientService.putPatient(
      req.params.id,
      {
        trimedFirstName,
        trimedLastName,
        diagnosis,
        socialwork,
        affiliateNumber,
        authorizedModule,
        dni,
        birth,
        email,
        phone,
        adress,
        cud,
        school,
        shift,
        schoolYear,
      },
      null,
      false,
      filename
    );

    const professionalsArray = JSON.parse(professionals);

    if (editedPatient) {
      professionalsArray.forEach(async (prof: INames) => {
        const findedProf = await userService.searchUser(prof);
        await userService.putUser(findedProf[0]._id, undefined, editedPatient._id);
        await patientService.putPatient(editedPatient._id, undefined, findedProf[0]._id);
      });
    }

    res.send(editedPatient);
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
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
    console.error(e);
    throw new ServerError(e);
  }
};

const httpUnassignProf = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { profName } = req.body;

    const patient = await patientService.getOnePatient(req.params.id);

    if (patient) {
      const findedProf = await userService.searchUser(profName);
      await userService.putUser(findedProf[0]._id, undefined, patient._id, true);
      await patientService.putPatient(patient._id, undefined, findedProf[0]._id, true);
    }

    res.send({ patient, profName });
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
};

const httpSearchPatient = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const name = req.params.name ? req.params.name : '*';
    const page = parseInt(req.params.page);
    const findedPatients = await patientService.searchPatient(name, page);
    res.send(findedPatients);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpDownloadCertificate = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const patient = await patientService.getOnePatient(req.params.id);

    // const responseFileName = `Certificado-de-${patient?.firstName}-${patient?.lastName}`;

    // const fileName = getFile([
    //   `${patient?.firstName}`,
    //   `${patient?.lastName}`,
    //   `${patient?.dni}`,
    // ]);
    // const filePath = path.join(__dirname, `../../../certificates/${fileName}`);

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename=${responseFileName}`);

    // res.sendFile(filePath);
    res.send(
      `http://${process.env.SERVER_IP}:8000/download/certificate/${patient?.certificate[0]}`
    );
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
};

const httpDeleteCertificate = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (!loggedUser.patientsId.includes(req.params.id) && loggedUser.admin === false)
        throw new BadRequestError('No posee permisos para editar este paciente');
    }
    const { fileName } = req.body;

    const patient = await patientService.getOnePatient(req.params.id);

    if (patient) {
      const filePath = path.join(__dirname, `../../../certificates/${fileName}`);

      fs.unlink(`${filePath}`, err => {
        if (err) throw new ServerError(err);
        console.log('El archivo fue eliminado exitosamente');
      });

      await patientService.putPatient(patient._id, undefined, null, true, fileName);
    }

    res.send(patient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpUploadReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (!loggedUser.patientsId.includes(req.params.id) && loggedUser.admin === false)
        throw new BadRequestError('No posee permisos para subir un informe en este paciente');
    }

    const filename = req.file && req.file.filename;

    const editedPatient = await patientService.putPatient(
      req.params.id,
      undefined,
      null,
      false,
      undefined,
      filename
    );

    performTask(loggedUser._id, 'Subió un informe');
    loggedUser.save();

    res.send(editedPatient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpUploadMedicalReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (!loggedUser.patientsId.includes(req.params.id) && loggedUser.admin === false)
        throw new BadRequestError('No posee permisos para editar este paciente');
    }
    const filename = req.file && req.file.filename;

    const editedPatient = await patientService.putPatient(
      req.params.id,
      undefined,
      null,
      false,
      undefined,
      undefined,
      filename
    );

    performTask(loggedUser._id, 'Subió un informe');
    loggedUser.save();

    res.send(editedPatient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpUploadSocialReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (!loggedUser.patientsId.includes(req.params.id) && loggedUser.admin === false)
        throw new BadRequestError('No posee permisos para editar este paciente');
    }
    const filename = req.file && req.file.filename;

    const editedPatient = await patientService.putPatient(
      req.params.id,
      undefined,
      null,
      false,
      undefined,
      undefined,
      undefined,
      filename
    );

    performTask(loggedUser._id, 'Subió un informe');
    loggedUser.save();

    res.send(editedPatient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpDeleteReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { fileName } = req.body;

    const fileOwnerId = fileName.split('_')[0];

    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (loggedUser.admin === false) {
        if (loggedUser._id.toString() !== fileOwnerId)
          throw new BadRequestError('No posee permisos para borrar este informe');
      }
    }

    const patient = await patientService.getOnePatient(req.params.id);

    if (patient) {
      const filePath = path.join(__dirname, `../../../reports/${fileName}`);

      fs.unlink(`${filePath}`, err => {
        if (err) throw new ServerError(err);
        console.log('El archivo fue eliminado exitosamente');
      });

      await patientService.putPatient(patient._id, undefined, null, true, undefined, fileName);
    }

    res.send(patient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpDeleteMedicalReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { fileName } = req.body;

    const fileOwnerId = fileName.split('_')[0];

    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (loggedUser.admin === false) {
        if (loggedUser._id.toString() !== fileOwnerId)
          throw new BadRequestError('No posee permisos para borrar este informe');
      }
    }

    const patient = await patientService.getOnePatient(req.params.id);

    if (patient) {
      const filePath = path.join(__dirname, `../../../medicalReports/${fileName}`);

      fs.unlink(`${filePath}`, err => {
        if (err) throw new ServerError(err);
        console.log('El archivo fue eliminado exitosamente');
      });

      await patientService.putPatient(
        patient._id,
        undefined,
        null,
        true,
        undefined,
        undefined,
        fileName
      );
    }

    res.send(patient);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpDeleteSocialReport = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { fileName } = req.body;

    const fileOwnerId = fileName.split('_')[0];

    const { user } = validateToken(req.session?.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    if (loggedUser) {
      if (loggedUser.admin === false) {
        if (loggedUser._id.toString() !== fileOwnerId)
          throw new BadRequestError('No posee permisos para borrar este informe');
      }
    }

    const patient = await patientService.getOnePatient(req.params.id);

    if (patient) {
      const filePath = path.join(__dirname, `../../../socialReports/${fileName}`);

      fs.unlink(`${filePath}`, err => {
        if (err) throw new ServerError(err);
        console.log('El archivo fue eliminado exitosamente');
      });

      await patientService.putPatient(
        patient._id,
        undefined,
        null,
        true,
        undefined,
        undefined,
        undefined,
        fileName
      );
    }

    res.send(patient);
  } catch (e) {
    throw new ServerError(e);
  }
};

export default {
  httpGetAllPatientsFromTherapist,
  httpGetAllPatients,
  httpPostPatient,
  httpGetOnePatient,
  httpEditPatient,
  httpDeletePatient,
  httpUnassignProf,
  httpSearchPatient,
  httpDownloadCertificate,
  httpDeleteCertificate,
  httpUploadReport,
  httpDeleteReport,
  httpUploadMedicalReport,
  httpUploadSocialReport,
  httpDeleteMedicalReport,
  httpDeleteSocialReport,
};
