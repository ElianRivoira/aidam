const express = require('express');
const patientController = require('./patient.controller');

const patientRouter = express.Router();

patientRouter.get('/', patientController.httpAllPatients);

patientRouter.post('/', patientController.httpPostPatient);

patientRouter.get('/:id', patientController.httpGetOnePatient);

patientRouter.put('/:id', patientController.httpEditPatient);

patientRouter.delete('/:id', patientController.httpDeletePatient);

export default patientRouter;
