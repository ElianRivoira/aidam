import express from 'express';
import userController from './user.controller';
import { validateSignUp } from '../../middlewares/userValidators';

const router = express.Router();

router.post('/', validateSignUp, userController.httpSignUp);

export default router;