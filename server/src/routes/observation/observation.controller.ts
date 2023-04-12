import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import observationService from '../../models/observations-service';
import patientService from '../../models/patient-service';
import { RequestValidationError } from '../../errors/request-validation-error';

const httpPostObservation = async (req: Request, res: Response) => {
  const { body } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const obs = await observationService.postObservation({
    title: body.title,
    observation: body.observation,
    date: body.date,
    professional: body.professional,
  });

  const patient = await patientService.getOnePatient(body.patientId);
  if (patient) {
    patient.observationsId.push(obs._id);
    patient.save();
  }

  res.status(201).send(obs);
};

const httpGetObservation = async (req: Request, res: Response) => {
  const obsId = req.params.id;

  const observation = await observationService.getObservation(obsId);

  res.send(observation);
}

const httpPutObservation = async (req: Request, res: Response) => {
  const obsId = req.params.id;
  const { text } = req.body;

  const observation = await observationService.putObservation(obsId, text);

  res.send(observation);
}

const httpDeleteObservation = async (req: Request, res: Response) => {
  const obsId = req.params.id;

  const observation = await observationService.deleteObservation(obsId);

  res.send(observation);
}

export default { httpPostObservation, httpGetObservation, httpPutObservation, httpDeleteObservation };
