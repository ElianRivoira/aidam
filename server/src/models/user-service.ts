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
  const loggedUser = await User.findOne({ email: user.email });
  if (loggedUser) {
    const match = await Password.compare(loggedUser.password, user.password);
    if (match) {
      const tokenPayload = {
        id: loggedUser._id,
        username: loggedUser.name,
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
  if(user) throw new BadRequestError('El usuario no existe');
  return user;
};

const exists = async (email: string): Promise<UserDoc | null> => {
  const user = await User.findOne({ email });
  return user;
};

export default { signUp, exists, userLogin, getLoggedUser };
