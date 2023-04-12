const express = require('express');
const patientController = require('./patient.controller');

const patientRouter = express.Router();

patientRouter.get('/', patientController.httpGetAllPatients);

patientRouter.get(
  '/from/:id',
  patientController.httpGetAllPatientsFromTherapist
);

patientRouter.post('/', patientController.httpPostPatient);

patientRouter.get('/:id', patientController.httpGetOnePatient);

patientRouter.put('/:id', patientController.httpEditPatient);

patientRouter.delete('/:id', patientController.httpDeletePatient);

export default patientRouter;
