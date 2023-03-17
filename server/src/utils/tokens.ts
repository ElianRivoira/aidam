import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface Payload {
  [key: string]: any;
}

const generateToken = (payload: Payload): string => {
  const token = jwt.sign({ user: payload }, process.env.TOKEN_PASSPHRASE as string);
  return token;
};

const validateToken = (token: string): Payload => {
  return jwt.verify(token, process.env.TOKEN_PASSPHRASE as string) as Payload;
};

export { generateToken, validateToken };