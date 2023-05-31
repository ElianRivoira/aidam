import { body, cookie, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { validateToken } from '../utils/tokens';

const validateSignUp = [
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  body('email')
    .isEmail()
    .withMessage('Debe ingresar un correo electrónico válido'),
  body('license').notEmpty().withMessage('El número de matrícula es requerido'),
  body('profession').notEmpty().withMessage('La profesión es requerida'),
  body('phone').notEmpty().withMessage('El número de teléfono es requerido'),
];

const validateLogin = [
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  body('email')
    .isEmail()
    .withMessage('Debe ingresar un correo electrónico válido'),
];

const validateLoggedUser = [
  cookie('session').custom((value, { req }) => {
    if (!req.session.token) {
      throw new Error('Debe estar logueado en la aplicación');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    next();
  },
];


const validateLoggedAdmin = [
  cookie('session').custom((value, { req }) => {
    
    if (!req.session.token) {
      throw new Error('Debe estar logueado en la aplicación');
    } else {
      const { user } = validateToken(req.session.token);
      if (!user.admin) {
        throw new Error('Debe tener permisos de administrador');
      } else return true;
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

export {
  validateSignUp,
  validateLogin,
  validateLoggedUser,
  validateLoggedAdmin,
};
