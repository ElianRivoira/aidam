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

const router = express.Router();

router.post('/', validateSignUp, userController.httpSignUp);

router.post('/login', validateLogin, userController.httpUserLogin);

router.get('/me', validateLoggedUser, userController.httpGetUser);

router.get('/', validateLoggedUser, userController.httpGetAllUsers);

router.get('/search/:name', validateLoggedUser, userController.httpSearchUser);

router.get("/:id", validateLoggedAdmin, userController.httpGetUserById)

router.put(
  '/register/:id',
  validateLoggedAdmin,
  userController.httpRegisterUser
);

router.put('/', validateLoggedUser, userController.httpPutUser);

router.delete('/:id', validateLoggedAdmin, userController.httpDeleteUser);

export default router;
