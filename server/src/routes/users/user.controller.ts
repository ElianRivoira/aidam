import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import userService from '../../models/user-service';
import { BadRequestError } from '../../errors/bad-request-error';
import { RequestValidationError } from '../../errors/request-validation-error';
import userService from '../../models/user-service';
import { AuthenticatedRequest } from '../../middlewares/auth';

const httpSignUp = async (req: Request, res: Response) => {
  const { body } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const userExists = await userService.exists(body.email);
  if (userExists)
    throw new BadRequestError('Ya existe una cuenta con ese email');

  const user = await userService.signUp({
    name: body.name,
    email: body.email,
    password: body.password,
    license: body.license,
    profession: body.profession,
    phone: body.phone,
  });

  res.status(201).send(user);
};

async function httpUserLogin(req: Request, res: Response) {
  const user = req.body;

  if (!user.email) {
    return res.status(401).json({
      error: 'Required user property',
    });
  }
  if (!user.password) {
    return res.status(401).json({
      error: 'Required password',
    });
  }

  const loggedUser = await userService.userLogin(user);

  if (req.session) {
    req.session.token = loggedUser?.token;
  }

  res.send(loggedUser);
}

const httpGetUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const userId = req.user.id;
      const user = await userService.getLoggedUser(userId);
      res.send(user);
    }
  } catch (e) {
    next(e);
  }
};

export default { httpSignUp, httpUserLogin, httpGetUser };
