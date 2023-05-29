import { body, param, validationResult } from 'express-validator';
import { validateToken } from '../utils/tokens';
import { RequestValidationError } from '../errors/request-validation-error';
import { NextFunction, Request, Response } from 'express';

const validateObs = [
  body('title').notEmpty().withMessage('El título de la observación es requerido'),
  body('observation').notEmpty().withMessage('El detalle de la observación es requerido'),
  body('date').notEmpty().withMessage('La fecha de la observación es requerida'),
];

const validateEditObs = [body('text').notEmpty().withMessage('El detalle de la observación es requerido')];

const validateObsOwner = [
  param('id').custom((value, { req }) => {
    if (!req.session.token) {
      throw new Error('Debe estar logueado en la aplicación');
    } else {
      const { user } = validateToken(req.session.token);
      if (user.admin) return true;
      const obsId = value;
      console.log('HOLA', user.observationsId)
      if (user.observationsId?.includes(obsId)) return true;
      else throw new Error('No posee permisos para editar o eliminar esta observación');
    }
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    next();
  },
];

export { validateObs, validateEditObs, validateObsOwner };
