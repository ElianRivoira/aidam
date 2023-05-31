import { body } from 'express-validator';

const validatePatient = [
  body('firstName')
    .notEmpty()
    .withMessage('El nombre del paciente es requerido'),
  body('lastName')
    .notEmpty()
    .withMessage('El apellido del paciente es requerido'),
  body('diagnosis')
    .notEmpty()
    .withMessage('El diagnóstico del paciente es requerido'),
  body('authorizedModule')
    .notEmpty()
    .withMessage('El módulo autorizado del paciente es requerido'),
  body('socialwork')
    .notEmpty()
    .withMessage('La obra social del paciente es requerida'),
  body('affiliateNumber')
    .notEmpty()
    .withMessage('El número de afiliado del paciente es requerido'),
  body('dni')
    .notEmpty()
    .withMessage('El dni del paciente es requerido')
    .isNumeric()
    .withMessage('El dni del paciente debe ser un número'),
  body('birth')
    .notEmpty()
    .withMessage('La fecha de nacimiento del paciente es requerida'),
  body('email')
    .notEmpty()
    .withMessage('El correo electrónico de contacto del paciente es requerido')
    .isEmail()
    .withMessage('El correo electrónico de contacto del paciente tiene un formato inválido'),
  body('phone')
    .notEmpty()
    .isMobilePhone('es-AR')
    .withMessage('El número de teléfono de contacto del paciente es requerido'),
];

export { validatePatient };
