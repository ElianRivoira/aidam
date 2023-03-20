import { body } from 'express-validator';

const validateObs = [
  body('title')
    .notEmpty()
    .withMessage('El título de la observación es requerido'),
  body('observation')
    .notEmpty()
    .withMessage('El detalle de la observación es requerido'),
  body('professional')
    .notEmpty()
    .withMessage('El nombre del terapeuta es requerido'),
];

export { validateObs };