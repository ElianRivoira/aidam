import express from 'express';
import userController from './user.controller';
import { validateSignUp } from '../../middlewares/userValidators';
import { validateLoggedUser } from '../../middlewares/auth';

const router = express.Router();

router.post('/', validateSignUp, userController.httpSignUp);
router.post('/login', userController.httpUserLogin);
router.get('/me', [validateLoggedUser], userController.httpGetUser);

export default router;
