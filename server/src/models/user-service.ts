import User, { UserAttrs, UserDoc } from './user.model';
import { Password } from '../services/password';
import { generateToken } from '../utils/tokens';
import { BadRequestError } from '../errors/bad-request-error';

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

async function userLogin(user: LoginAttrs): Promise<LoginResponse | undefined> {
  const loggedUser = await User.findOne({ email: user.email }, { __v: 0 });
  if (loggedUser) {
    const match = await Password.compare(loggedUser.password, user.password);
    loggedUser.password = '';
    if (match) {
      const now = new Date();
      loggedUser.lastLoginDate = now;
      await User.findOneAndUpdate(
        { _id: loggedUser._id },
        { $set: { lastLoginDate: now } }
      );
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
    }
  } else {
    throw new BadRequestError('El usuario no existe');
  }
}

const getLoggedUser = async (id: String) => {
  const user = await User.findById(id, { password: 0, __v: 0 });
  if (!user) throw new BadRequestError('El usuario no existe');
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
    const result = await User.findOneAndUpdate(
      { _id: id },
      { status: true },
      { new: true }
    );
    if (!result) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, message: 'User status updated' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error updating user status' };
  }
};

const deleteUser = async (id: string) => {
  try {
    const result = await User.findOneAndDelete({ _id: id }, { new: true });

    if (!result) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error deleting user' };
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
};
