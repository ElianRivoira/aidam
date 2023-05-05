import express from 'express';
import userController from './user.controller';
import {
  validateLogin,
  validateSignUp,
} from '../../middlewares/userValidators';
import {
  validateLoggedUser,
  validateLoggedAdmin,
} from '../../middlewares/userValidators';
import { uploadProfileImage } from '../../middlewares/multer';

const router = express.Router();

router.post('/', validateSignUp, userController.httpSignUp);

router.post('/login', validateLogin, userController.httpUserLogin);

router.get('/me', validateLoggedUser, userController.httpGetUser);

router.get('/recover-password', userController.httpRecoverPassword);

router.get('/', validateLoggedUser, userController.httpGetAllUsers);

router.get('/search/:name', validateLoggedUser, userController.httpSearchUser);

router.get('/:id', validateLoggedUser, userController.httpGetUserById);

router.put('/forgot-password', userController.httpForgotPassword);

router.put(
  '/register/:id',
  validateLoggedAdmin,
  userController.httpRegisterUser
);

router.put(
  '/',
  validateLoggedUser,
  uploadProfileImage.single('profileImage'),
  userController.httpPutUser
);

router.put(
  '/unassign/:id',
  validateLoggedAdmin,
  userController.httpUnassignPatient
);

router.put('/changePassword', userController.httpChangePassword);

router.delete('/:id', validateLoggedAdmin, userController.httpDeleteUser);

export default router;
