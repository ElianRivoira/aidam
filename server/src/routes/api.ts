import express from 'express';
import userRouter from './users/user.router'


const api = express.Router();

api.use('/users', userRouter);

export default api;
