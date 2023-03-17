const express = require('express');
import { Request, Response } from 'express';

import patientRouter from './patients/patient.router';

const api = express.Router();


api.use('/patients', patientRouter);

export default api;
