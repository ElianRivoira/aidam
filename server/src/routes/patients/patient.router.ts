const express = require('express');
const patientController = require('./patient.controller');
import { uploadCertificate, uploadMedicalReport, uploadReport, uploadSocialReport } from '../../middlewares/multer';
import { validatePatient, validatePatientOwner } from '../../middlewares/patientValidators';
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
    validatePatientOwner,
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

patientRouter.put(
  '/delete/certificate/:id',
  validatePatientOwner,
  patientController.httpDeleteCertificate
);

patientRouter.put(
  '/uploadReport/:id',
  [validatePatientOwner, uploadReport.single('report')],
  patientController.httpUploadReport
);

patientRouter.put(
  '/uploadReport/medical/:id',
  [validatePatientOwner, uploadMedicalReport.single('report')],
  patientController.httpUploadMedicalReport
);

patientRouter.put(
  '/uploadReport/social/:id',
  [validatePatientOwner, uploadSocialReport.single('report')],
  patientController.httpUploadSocialReport
);

patientRouter.put(
  '/delete/report/:id',
  validatePatientOwner,
  patientController.httpDeleteReport
);

patientRouter.put(
  '/delete/report/medical/:id',
  validatePatientOwner,
  patientController.httpDeleteMedicalReport
);

patientRouter.put(
  '/delete/report/social/:id',
  validatePatientOwner,
  patientController.httpDeleteSocialReport
);

patientRouter.delete(
  '/:id',
  validatePatientOwner,
  patientController.httpDeletePatient
);

export default patientRouter;
