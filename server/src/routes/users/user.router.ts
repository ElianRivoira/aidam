import express from 'express';
import userController from './user.controller';
import { validateLogin, validateSignUp } from '../../middlewares/userValidators';
import { validateLoggedUser } from '../../middlewares/userValidators';

const router = express.Router();

router.post('/', validateSignUp, userController.httpSignUp);
router.post('/login', validateLogin, userController.httpUserLogin);
router.get('/me', userController.httpGetUser);

export default router;
