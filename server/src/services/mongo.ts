import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL ?? '';

mongoose.connection.once('open', (): void => {
  console.log('MongoDB está listo!');
});

mongoose.connection.on('error', (err: Error): void => {
  console.error('¡MongoDB tiene un error! =>', err);
});

async function mongoConnect(): Promise<void> {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(): Promise<void> {
  await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };