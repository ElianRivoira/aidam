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

const exists = async (email: string): Promise<UserDoc | null> => {
  const user = await User.findOne({ email });
  return user;
};

const searchUser = async (name: string): Promise<UserDoc[]> => {
  let findedUsers: UserDoc[];
  if (name.includes(' ')) {
    const [firstName, lastName] = name.split(' ');
    findedUsers = await User.find({
      $or: [
        { firstName: { $regex: `.*${firstName}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${lastName}.*`, $options: 'i' } },
      ],
    });
  } else {
    findedUsers = await User.find({
      $or: [
        { firstName: { $regex: `.*${name}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${name}.*`, $options: 'i' } },
      ],
    });
  }
  return findedUsers;
};

export default { signUp, exists, userLogin, getLoggedUser, searchUser };
