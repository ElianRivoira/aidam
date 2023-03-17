import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import observationService from '../../models/observations-service';
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
    professional: body.professional,
  });

  res.status(201).send(obs);
};

export default { httpPostObservation };
