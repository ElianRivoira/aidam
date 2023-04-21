import express, { Express, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import apiRouter from './routes/api';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'session',
    secret: process.env.TOKEN_PASSPHRASE, // Replace with your own secret key
    maxAge: 24 * 60 * 60 * 1000, // Set the cookie to expire after 24 hours
    secure: false, // Set to true if using HTTPS
    httpOnly: false,
    sameSite: 'strict',
  })
);
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/download/certificate', express.static(path.join(__dirname, '../certificates')))

app.use('/api', apiRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
