import { body } from 'express-validator';

const validateObs = [
  body('title')
    .notEmpty()
    .withMessage('El título de la observación es requerido'),
  body('observation')
    .notEmpty()
    .withMessage('El detalle de la observación es requerido'),
  body('date')
    .notEmpty()
    .withMessage('La fecha de la observación es requerida'),
];

const validateEditObs = [
  body('text')
    .notEmpty()
    .withMessage('El detalle de la observación es requerido'),
];

export { validateObs, validateEditObs };
