import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { validateToken } from '../utils/tokens';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    dni: string;
    admin: boolean;
  };
}

const validateLoggedUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('token');
  if (!token) return res.sendStatus(401);

  try {
    const { user } = validateToken(token);
    if (!user) return res.sendStatus(401);
    req.user = user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
};

const validateLoggedAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.admin !== true) return res.sendStatus(401);
  next();
};

// Combined middleware to authenticate admin
const validateAdmin = [validateLoggedUser, validateLoggedAdmin];

export { validateLoggedUser, validateLoggedAdmin };
