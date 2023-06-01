import express from 'express';
import patientController from './patient.controller';
import { uploadCertificate, uploadMedicalReport, uploadReport, uploadSocialReport } from '../../middlewares/multer';
import { validatePatient } from '../../middlewares/patientValidators';
import { validateLoggedAdmin, validateLoggedUser } from '../../middlewares/userValidators';

const patientRouter = express.Router();

patientRouter.get('/', validateLoggedUser, patientController.httpGetAllPatients);

patientRouter.get('/from/:id', patientController.httpGetAllPatientsFromTherapist);

patientRouter.get('/:id', validateLoggedUser, patientController.httpGetOnePatient);

patientRouter.get('/search/:name', validateLoggedUser, patientController.httpSearchPatient);

patientRouter.get('/download/certificate/:id', validateLoggedUser, patientController.httpDownloadCertificate);

patientRouter.post(
  '/',

  validateLoggedAdmin,
  uploadCertificate.single('certificate'),
  validatePatient,

  patientController.httpPostPatient
);

patientRouter.put(
  '/:id',

  validateLoggedUser,
  uploadCertificate.single('certificate'),
  validatePatient,

  patientController.httpEditPatient
);

patientRouter.put('/unassign/:id', validateLoggedAdmin, patientController.httpUnassignProf);

patientRouter.put('/delete/certificate/:id', validateLoggedAdmin, patientController.httpDeleteCertificate);

patientRouter.put(
  '/uploadReport/:id',
  validateLoggedUser,
  uploadReport.single('report'),
  patientController.httpUploadReport
);

patientRouter.put(
  '/uploadReport/medical/:id',
  validateLoggedUser,
  uploadMedicalReport.single('report'),
  patientController.httpUploadMedicalReport
);

patientRouter.put(
  '/uploadReport/social/:id',
  validateLoggedUser,
  uploadSocialReport.single('report'),
  patientController.httpUploadSocialReport
);

patientRouter.put('/delete/report/:id', validateLoggedUser, patientController.httpDeleteReport);

patientRouter.put('/delete/report/medical/:id', validateLoggedUser, patientController.httpDeleteMedicalReport);

patientRouter.put('/delete/report/social/:id', validateLoggedUser, patientController.httpDeleteSocialReport);

patientRouter.delete('/:id', validateLoggedAdmin, patientController.httpDeletePatient);

export default patientRouter;
