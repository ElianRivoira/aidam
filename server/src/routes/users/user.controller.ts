import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import userService from '../../models/user-service';
import { BadRequestError } from '../../errors/bad-request-error';
import { RequestValidationError } from '../../errors/request-validation-error';
import { validateToken } from '../../utils/tokens';

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
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const response = await userService.userLogin({ email, password });

  if (req.session) {
    req.session.token = response?.token;
  }

  res.send(response?.user);
}

const httpGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    if (req.session?.token) {
      const { userCookie } = validateToken(req.session.token)
      const user = await userService.getLoggedUser(userCookie._id);
      res.send(user);
    }
};

export default { httpSignUp, httpUserLogin, httpGetUser };
