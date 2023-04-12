import express from 'express';

import { validateObs } from '../../middlewares/observationValidators';
import observationController from './observation.controller';
import { validateLoggedUser } from '../../middlewares/userValidators';

const router = express.Router();

router.post('/', validateLoggedUser, validateObs, observationController.httpPostObservation);

router.get('/:id', validateLoggedUser, observationController.httpGetObservation);

router.put('/edit/:id', validateLoggedUser, observationController.httpPutObservation);

router.delete('/:patientId/delete/:id', validateLoggedUser, observationController.httpDeleteObservation);

export default router;
