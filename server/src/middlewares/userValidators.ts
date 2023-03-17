import { body } from 'express-validator';

const validateSignUp = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email')
    .isEmail()
    .withMessage('Debe ingresar un correo electrónico válido'),
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('license').notEmpty().withMessage('El número de matrícula es requerido'),
  body('profession').notEmpty().withMessage('La profesión es requerida'),
  body('phone').notEmpty().withMessage('El número de teléfono es requerido'),
];

export { validateSignUp };
