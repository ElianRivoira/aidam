import http from 'http';
import dotenv from 'dotenv';

import app from './app';
import { mongoConnect } from './services/mongo';
//añadir import de modelos
import User from './models/user.model';

dotenv.config();

const PORT: number | string = process.env.PORT || 8000;

const server: http.Server = http.createServer(app);

async function startServer(): Promise<void> {
  await mongoConnect();

  server.listen(PORT, (): void => {
    console.log(`Listening on port ${PORT}..`);
  });
}

startServer();
