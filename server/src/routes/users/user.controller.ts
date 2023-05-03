import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs'

import userService from '../../models/user-service';
import { BadRequestError } from '../../errors/bad-request-error';
import { RequestValidationError } from '../../errors/request-validation-error';
import { validateToken } from '../../utils/tokens';
import { ServerError } from '../../errors/server-error';
import patientService from '../../models/patient-service';
import getProfileImg from '../../utils/getProfileImg';

const httpRegisterUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const userId = req.params.id;
  const result = await userService.registerUser(userId);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(400).json({ message: result.message });
  }
};

const httpGetUserById = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const userId = req.params.id;
  const result = await userService.getUserById(userId);

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    const status = result.message === 'User not found' ? 404 : 500;
    res.status(status).json({ message: result.message });
  }
};

const httpDeleteUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const userId = req.params.id;
  const result = await userService.deleteUser(userId);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(400).json({ message: result.message });
  }
};

const httpGetAllUsers = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  if (req.session?.token) {
    const { user } = validateToken(req.session.token);
    const users = await userService.getAllUsers(user.id);
    res.status(200).json(users);
  }
};

const httpSignUp = async (req: Request, res: Response) => {
  const { body } = req;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const userExists = await userService.exists(body.email);
  if (userExists)
    throw new BadRequestError(
      'Ya existe una cuenta con este email. Por favor intente nuevamente con un correo distinto'
    );

  const user = await userService.signUp({
    firstName: body.firstName,
    lastName: body.lastName,
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
  try {
    const response = await userService.userLogin({ email, password });

    if (req.session) {
      req.session.token = response?.token;
    }

    res.send(response?.user);
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
}

const httpGetUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  if (req.session?.token) {
    const { user } = validateToken(req.session.token);
    const loggedUser = await userService.getLoggedUser(user.id);
    res.send(loggedUser);
  }
};

const httpSearchUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const findedUsers = await userService.searchUser(req.params.name);
  res.send(findedUsers);
};

const httpPutUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { email, phone, firstName, lastName, license, profession } = req.body;
    if (req.session?.token) {
      const { user } = validateToken(req.session.token);

      const profileImg = req.file?.filename;

      const updatedUser = await userService.putUser(user.id, {
        email,
        phone,
        firstName,
        lastName,
        license,
        profession,
      }, undefined, false, profileImg);
      res.send(updatedUser);
    }
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
};

const httpUnassignPatient = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  try {
    const { patientName } = req.body;

    const { data } = await userService.getUserById(req.params.id);

    if (data) {
      const findedPatient = await patientService.searchPatient(patientName);
      await patientService.putPatient(
        findedPatient[0]._id,
        undefined,
        data._id,
        true
      );
      await userService.putUser(
        data._id,
        undefined,
        findedPatient[0]._id,
        true
      );
    }

    res.send(data);
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
};

export default {
  httpSignUp,
  httpUserLogin,
  httpGetUser,
  httpGetAllUsers,
  httpRegisterUser,
  httpDeleteUser,
  httpSearchUser,
  httpPutUser,
  httpGetUserById,
  httpUnassignPatient,
};
