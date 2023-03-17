import express from 'express';
import userRouter from './users/user.router'

import patientRouter from './patients/patient.router';

const api = express.Router();

api.use('/patients', patientRouter);
api.use('/users', userRouter);


export default api;
