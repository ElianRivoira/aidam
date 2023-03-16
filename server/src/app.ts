import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import apiRouter from './routes/api'; 

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', apiRouter);

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;