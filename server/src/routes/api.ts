import express from 'express';

import userRouter from './users/user.router';
import observationRouter from './observation/observation.router';
import patientRouter from './patients/patient.router';

const api = express.Router();

api.use('/patients', patientRouter);
api.use('/users', userRouter);
api.use('/observations', observationRouter);


export default api;
