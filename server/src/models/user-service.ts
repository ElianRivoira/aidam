import User, { UserAttrs, UserDoc } from './user.model';
import { Password } from '../services/password';
import { generateToken } from '../utils/tokens';

const signUp = async (data: UserAttrs): Promise<UserDoc> => {
  const user = User.build(data);
  await user.save();
  return user;
};

async function userLogin(user: UserAttrs) {
  try {
    const loggedUser = await User.findOne({ email: user.email });
    if (loggedUser) {
      const match = await Password.compare(loggedUser.password, user.password);
      if (match) {
        const tokenPayload = {
          id: loggedUser._id,
          username: loggedUser.name,
          dni: loggedUser.email,
          admin: loggedUser.admin,
        };
        const token = generateToken(tokenPayload);
        return {
          user: loggedUser,
          token,
        };
      }
    } else {
      return {
        error: 'User not exist!',
      };
    }
  } catch (e) {
    throw new Error(e as string);
  }
}

const getLoggedUser = async (id: String) => {
  const user = await User.findById(id, { password: 0, __v: 0 });
  return user;
};

const exists = async (email: string): Promise<UserDoc | null> => {
  const user = await User.findOne({ email });
  return user;
};

export default { signUp, exists, userLogin, getLoggedUser };
