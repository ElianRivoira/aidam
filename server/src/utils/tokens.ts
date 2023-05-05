import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface Payload {
  [key: string]: any;
}

const generateToken = (payload: Payload): string => {
  const token = jwt.sign(
    { user: payload },
    process.env.TOKEN_PASSPHRASE as string
  );
  return token;
};

const validateToken = (token: string): Payload => {
  return jwt.verify(token, process.env.TOKEN_PASSPHRASE as string) as Payload;
};

const recoverPasswordToken = (email: string): string => {
  const token = jwt.sign({ email }, process.env.TOKEN_PASSPHRASE as string, {
    expiresIn: '15m',
  });
  return token;
};

const validateRecoverToken = (token: string): Payload => {
  return jwt.verify(token, process.env.TOKEN_PASSPHRASE as string) as {
    email: string;
  };
};

export {
  generateToken,
  validateToken,
  recoverPasswordToken,
  validateRecoverToken,
};
