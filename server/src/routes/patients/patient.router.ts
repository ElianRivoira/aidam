const express = require('express');
const patientController = require('./patient.controller');
import { validateLoggedUser } from '../../middlewares/userValidators';

const patientRouter = express.Router();

patientRouter.get('/', validateLoggedUser, patientController.httpGetAllPatients);

patientRouter.get(
  '/from/:id',
  patientController.httpGetAllPatientsFromTherapist
);

patientRouter.post('/', validateLoggedUser, patientController.httpPostPatient);

patientRouter.get('/:id', validateLoggedUser, patientController.httpGetOnePatient);

patientRouter.put('/:id', validateLoggedUser, patientController.httpEditPatient);

patientRouter.delete('/:id', validateLoggedUser, patientController.httpDeletePatient);

export default patientRouter;
