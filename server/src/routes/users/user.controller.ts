import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import userService from '../../models/user-service';
import { BadRequestError } from '../../errors/bad-request-error';
import { RequestValidationError } from '../../errors/request-validation-error';
import { validateRecoverToken, validateToken } from '../../utils/tokens';
import { ServerError } from '../../errors/server-error';
import patientService from '../../models/patient-service';
import { NotFoundError } from '../../errors/not-found-error';
import INames from '../../interfaces/INames';

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

  const firstName = req.body.firstName.trim().replace(/\s+/g, ' ').toUpperCase();
  const lastName = req.body.lastName.trim().replace(/\s+/g, ' ').toUpperCase();

  const user = await userService.signUp({
    firstName: firstName,
    lastName: lastName,
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

    if (!response.user.status) throw new Error('Todavía no estas dado de alta en la aplicación');

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
    const loggedUser = await userService.getLoggedUser(user.id, true);
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
    const { email, phone, firstName, lastName, license, profession, _id, patients } = req.body;

    const user = await userService.getLoggedUser(_id, true);

    const profileImg = req.file?.filename;

    const trimedFirstName = firstName.trim().replace(/\s+/g, ' ').toUpperCase();
    const trimedLastName = lastName.trim().replace(/\s+/g, ' ').toUpperCase();

    const updatedUser = await userService.putUser(
      user._id,
      {
        email,
        phone,
        trimedFirstName,
        trimedLastName,
        license,
        profession,
      },
      undefined,
      false,
      profileImg
    );

    const patientsArray = JSON.parse(patients);

    if (updatedUser) {
      patientsArray.forEach(async (patient: INames) => {
        const { findedPatients } = await patientService.searchPatient(patient);
        await patientService.putPatient(findedPatients[0]._id, undefined, updatedUser._id);
        await userService.putUser(updatedUser._id, undefined, findedPatients[0]._id);
      });
    }

    res.send(updatedUser);
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
      const { findedPatients } = await patientService.searchPatient(patientName);
      await patientService.putPatient(findedPatients[0]._id, undefined, data._id, true);
      await userService.putUser(data._id, undefined, findedPatients[0]._id, true);
    }

    res.send({ user: data, patientName });
  } catch (e) {
    console.error(e);
    throw new ServerError(e);
  }
};

const httpForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Usuario requerido' });
  }

  let response = await userService.forgotPassword(email);

  if (response === 'El usuario no existe') {
    throw new NotFoundError('El usuario no existe');
  } else if (response instanceof Error) {
    throw new ServerError(response);
  } else {
    return res.status(200).json({ message: response });
  }
};

const httpRecoverPassword = async (req: Request, res: Response) => {
  const token = String(req.query.token);

  if (!token) {
    return res.status(204).send({ status: false, message: 'El Token no existe' });
  }

  try {
    const decodedToken = validateRecoverToken(token);
    const email = decodedToken.email;
    res.status(200).send({ status: true, message: 'El Token es válido', email });
  } catch (err) {
    return res.status(200).send({ status: false, message: 'El Token es inválido o ha expirado' });
  }
};

const httpChangePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'No hay usuario o contraseña' });
  }

  let response = await userService.changePassword(email, password);

  if (response === 'El usuario no existe') {
    throw new NotFoundError('El usuario no existe');
  } else if (response instanceof Error) {
    throw new ServerError(response);
  } else {
    return res.status(200).json({ message: response });
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
  httpForgotPassword,
  httpRecoverPassword,
  httpChangePassword,
};
