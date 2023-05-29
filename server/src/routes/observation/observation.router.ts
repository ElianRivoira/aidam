import express from 'express';

import { validateEditObs, validateObs, validateObsOwner } from '../../middlewares/observationValidators';
import observationController from './observation.controller';
import { validateLoggedUser } from '../../middlewares/userValidators';

const router = express.Router();

router.post('/', validateLoggedUser, validateObs, observationController.httpPostObservation);

router.get('/:id', validateLoggedUser, observationController.httpGetObservation);

router.put('/edit/:id', validateObsOwner, validateEditObs, observationController.httpPutObservation);

router.delete('/:patientId/delete/:id', validateObsOwner, observationController.httpDeleteObservation);

export default router;
