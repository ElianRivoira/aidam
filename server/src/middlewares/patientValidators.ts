import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';
import { validateToken } from '../utils/tokens';

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

const validatePatientOwner = [
  param('id').custom((value, { req }) => {
    if (!req.session.token) {
      throw new Error('Debe estar logueado en la aplicación');
    } else {
      const { user } = validateToken(req.session.token);
      if (user.admin) return true;
      const patientId = value;
      console.log('PATIENTID', patientId)
      if (user.patientsId?.includes(patientId)) return true;
      else throw new Error('No posee permisos para editar este paciente');
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

export { validatePatient, validatePatientOwner };
