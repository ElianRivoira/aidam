import express from 'express';

import { validateObs } from '../../middlewares/observationValidators';
import observationController from './observation.controller';

const router = express.Router();

router.post('/', validateObs, observationController.httpPostObservation);

router.get('/:id', observationController.httpGetObservation);

router.put('/edit/:id', observationController.httpPutObservation);

router.delete('/delete/:id', observationController.httpDeleteObservation);

export default router;
