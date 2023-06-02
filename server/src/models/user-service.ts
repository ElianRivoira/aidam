import { Document, Types } from 'mongoose';

import User, { UserAttrs, UserDoc } from './user.model';
import { Password } from '../services/password';
import { generateToken, recoverPasswordToken } from '../utils/tokens';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import INames from '../interfaces/INames';
import { sendPasswordChangerEmail } from '../utils/emails';

import dotenv from 'dotenv';
dotenv.config();

const signUp = async (data: UserAttrs): Promise<UserDoc> => {
  const user = User.build(data);
  await user.save();
  return user;
};

interface LoginResponse {
  user: UserDoc;
  token: string;
}
interface LoginAttrs {
  email: string;
  password: string;
}

async function userLogin(user: LoginAttrs): Promise<LoginResponse> {
  const loggedUser = await User.findOne({ email: user.email }, { __v: 0 });
  if (loggedUser) {
    const match = await Password.compare(loggedUser.password, user.password);
    loggedUser.password = '';
    if (match) {
      const now = new Date();
      loggedUser.lastLoginDate = now;
      await User.findOneAndUpdate({ _id: loggedUser._id }, { $set: { lastLoginDate: now } });
      const tokenPayload = {
        id: loggedUser._id,
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        email: loggedUser.email,
        admin: loggedUser.admin,
      };
      const token = generateToken(tokenPayload);
      return {
        user: loggedUser,
        token,
      };
    } else {
      throw new BadRequestError('El usuario o la contraseña son incorrectos');
    }
  } else {
    throw new BadRequestError('El usuario o la contraseña son incorrectos');
  }
}

const getLoggedUser = async (id: String, populate?: boolean) => {
  let user:
    | (Document<unknown, {}, UserDoc> &
        Omit<
          UserDoc & {
            _id: Types.ObjectId;
          },
          never
        >)
    | null = null;
  if (populate) {
    user = await User.findById(id, { password: 0, __v: 0 }).populate({
      path: 'patientsId',
      options: { populate: { path: 'professionalsId' } },
    });
  } else {
    user = await User.findById(id, { password: 0, __v: 0 });
  }
  if (!user) throw new NotFoundError('El usuario no existe');
  return user;
};

const getAllUsers = async (id: String) => {
  const users = await User.find({ userId: { $ne: id } });
  return users;
};

const exists = async (email: string): Promise<UserDoc | null> => {
  const user = await User.findOne({ email });
  return user;
};

const registerUser = async (id: string) => {
  try {
    const result = await User.findOneAndUpdate({ _id: id }, { status: true }, { new: true });
    if (!result) {
      throw new NotFoundError('El usuario no existe');
    }
    return { success: true, message: 'User status updated' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error updating user status' };
  }
};

const getUserById = async (id: string) => {
  try {
    const result = await User.findById(id).populate('patientsId');
    if (!result) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error finding User' };
  }
};

const deleteUser = async (id: string) => {
  try {
    const result = await User.findOneAndDelete({ _id: id }, { new: true });

    if (!result) {
      throw new NotFoundError('El usuario no existe');
    }

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error deleting user' };
  }
};

const searchUser = async (name: string | INames): Promise<UserDoc[]> => {
  let findedUsers: UserDoc[];

  if (name === '*') {
    findedUsers = await User.find({ status: true });
  } else if (typeof name === 'object') {
    const { firstName1, firstName2, lastName1, lastName2, id } = name;
    findedUsers = await User.find({
      $and: [
        {
          $and: [
            {
              firstName: {
                $regex: `.*${firstName1}${firstName2 ? ` ${firstName2}` : ''}.*`,
                $options: 'i',
              },
            },
            {
              lastName: {
                $regex: `.*${lastName1}${lastName2 ? ` ${lastName2}` : ''}.*`,
                $options: 'i',
              },
            },
            {
              _id: id,
            },
          ],
        },
        { status: true },
      ],
    });
  } else {
    findedUsers = await User.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: `.*${name}.*`, $options: 'i' } },
            { lastName: { $regex: `.*${name}.*`, $options: 'i' } },
          ],
        },
        { status: true },
      ],
    });
  }
  return findedUsers;
};

const putUser = async (id: string, data?: object, patientId?: string, pull?: boolean, profileImg?: string) => {
  const findAndUpdate = () => {
    if (pull) {
      return User.findByIdAndUpdate(
        id,
        {
          ...data,
          $pull: { patientsId: patientId },
        },
        {
          new: true,
        }
      );
    } else {
      return User.findByIdAndUpdate(
        id,
        {
          ...data,
          profileImg,
          $addToSet: { patientsId: patientId },
        },
        {
          new: true,
        }
      );
    }
  };
  const user = await findAndUpdate();
  if (!user) throw new NotFoundError('El usuario no existe');
  return user;
};

const forgotPassword = async (email: string) => {
  try {
    let message: string;
    let user;
    user = await User.findOne({ email });
    if (user) {
      const token = recoverPasswordToken(email);
      const link = `http://${process.env.SERVER_IP}:3001/reset-password?token=${token}`;
      message = 'Se ha enviado un mensaje a tu email para recuperar tu clave';
      sendPasswordChangerEmail(email, link);
    } else {
      message = 'El usuario no existe';
    }
    return message;
  } catch (error) {
    return error;
  }
};

const changePassword = async (email: string, password: string) => {
  try {
    let message: string;
    let newHashedPassword;
    let user;
    newHashedPassword = await Password.toHash(password);
    user = await User.findOneAndUpdate({ email }, { password: newHashedPassword }, { new: true });
    if (user) {
      message = 'Tu contraseña ha cambiado';
    } else {
      message = 'El usuario no existe';
    }
  } catch (error) {
    return error;
  }
};

export default {
  signUp,
  exists,
  userLogin,
  getLoggedUser,
  getAllUsers,
  registerUser,
  deleteUser,
  searchUser,
  putUser,
  getUserById,
  forgotPassword,
  changePassword,
};
