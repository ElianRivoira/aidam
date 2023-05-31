import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import observationService from '../../models/observations-service';
import patientService from '../../models/patient-service';
import { RequestValidationError } from '../../errors/request-validation-error';
import userService from '../../models/user-service';
import { validateToken } from '../../utils/tokens';
import { performTask } from '../../services/taskMetric';
import { ServerError } from '../../errors/server-error';
import { BadRequestError } from '../../errors/bad-request-error';

const httpPostObservation = async (req: Request, res: Response) => {
  const { title, observation, date, patientId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    if (req.session?.token) {
      const { user } = validateToken(req.session.token);
      const loggedUser = await userService.getLoggedUser(user.id);

      if (!loggedUser.patientsId.includes(patientId))
        throw new BadRequestError('No posee permisos para crear una observación en este paciente');

      const obs = await observationService.postObservation({
        title: title,
        observation: observation,
        date: date,
        professional: loggedUser._id,
        patient: patientId,
      });

      const patient = await patientService.getOnePatient(patientId);
      if (patient) {
        patient.observationsId.push(obs._id);
        patient.save();
      }

      if (loggedUser) {
        performTask(loggedUser._id, 'Creó observación');
        loggedUser.observationsId.push(obs._id);
        loggedUser.save();
      }

      res.status(201).send(obs);
    }
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpGetObservation = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const obsId = req.params.id;

    const observation = await observationService.getObservation(obsId);

    res.send(observation);
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpPutObservation = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const obsId = req.params.id;
    const { text } = req.body;
    if (req.session?.token) {
      const { user } = validateToken(req.session.token);
      const loggedUser = await userService.getLoggedUser(user.id);

      if (!loggedUser.observationsId.includes(obsId))
        throw new BadRequestError('No posee permisos para editar o eliminar esta observación');

      const obs = await observationService.putObservation(obsId, text);
      performTask(loggedUser._id, 'Editó observación');

      res.status(201).send(obs);
    }
  } catch (e) {
    throw new ServerError(e);
  }
};

const httpDeleteObservation = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const obsId = req.params.id;
    const patientId = req.params.patientId;

    if (req.session?.token) {
      const { user } = validateToken(req.session.token);
      const loggedUser = await userService.getLoggedUser(user.id);

      const observation = await observationService.deleteObservation(obsId);

      const patient = await patientService.getOnePatient(patientId);

      if (loggedUser) {
        if (!loggedUser.observationsId.includes(obsId))
          throw new BadRequestError('No posee permisos para editar o eliminar esta observación');

        const observationToDelete = obsId;
        const index = loggedUser.observationsId.indexOf(observationToDelete);
        if (index > -1) {
          loggedUser.observationsId.splice(index, 1);
          performTask(loggedUser._id, 'Borró observación');
          loggedUser.save();
        }
      }

      if (patient) {
        const observationToDelete = obsId;
        const index = patient.observationsId.indexOf(observationToDelete);
        if (index > -1) {
          patient.observationsId.splice(index, 1);
          patient.save();
        }
      }
      res.send(observation);
    }
  } catch (e) {
    throw new ServerError(e);
  }
};

export default {
  httpPostObservation,
  httpGetObservation,
  httpPutObservation,
  httpDeleteObservation,
};
