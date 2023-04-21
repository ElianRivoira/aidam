const express = require('express');
const patientController = require('./patient.controller');
import { uploadCertificate } from '../../middlewares/multer';
import { validatePatient } from '../../middlewares/patientValidators';
import {
  validateLoggedAdmin,
  validateLoggedUser,
} from '../../middlewares/userValidators';

const patientRouter = express.Router();

patientRouter.get(
  '/',
  validateLoggedUser,
  patientController.httpGetAllPatients
);

patientRouter.get(
  '/from/:id',
  patientController.httpGetAllPatientsFromTherapist
);

patientRouter.get(
  '/:id',
  validateLoggedUser,
  patientController.httpGetOnePatient
);

patientRouter.get(
  '/search/:name',
  validateLoggedUser,
  patientController.httpSearchPatient
);

patientRouter.get(
  '/download/certificate/:id',
  validateLoggedUser,
  patientController.httpDownloadCertificate
);

patientRouter.post(
  '/',
  [
    validateLoggedAdmin,
    uploadCertificate.single('certificate'),
    validatePatient,
  ],
  patientController.httpPostPatient
);

patientRouter.put(
  '/:id',
  [
    validateLoggedAdmin,
    uploadCertificate.single('certificate'),
    validatePatient,
  ],
  patientController.httpEditPatient
);

patientRouter.put(
  '/unassign/:id',
  validateLoggedAdmin,
  patientController.httpUnassignProf
);

patientRouter.delete(
  '/:id',
  validateLoggedAdmin,
  patientController.httpDeletePatient
);

export default patientRouter;
