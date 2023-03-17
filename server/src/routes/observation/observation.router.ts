import express from 'express';

import { validateObs } from '../../middlewares/observationValidators';
import observationController from './observation.controller';

const router = express.Router();

router.post('/', validateObs, observationController.httpPostObservation);

export default router;