import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/api';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import { validateLoggedUser } from './middlewares/userValidators';

dotenv.config();

const app: Express = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_IP,
    credentials: true,
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    // optionsSuccessStatus: 200,
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
    domain: 'http://aidam.online'
  })
);
app.use(morgan('dev'));

app.use('/download/certificate', validateLoggedUser, express.static(path.join(__dirname, '../certificates')));

app.use('/users/profileimg', validateLoggedUser, express.static(path.join(__dirname, '../profilesImgs')));

app.use('/patients/reports', validateLoggedUser, express.static(path.join(__dirname, '../reports')));
app.use('/patients/reports/medical', validateLoggedUser, express.static(path.join(__dirname, '../medicalReports')));
app.use('/patients/reports/social', validateLoggedUser, express.static(path.join(__dirname, '../socialReports')));

app.use('/api', apiRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('');
});

app.use(errorHandler);

export default app;
