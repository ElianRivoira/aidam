import User,{ UserAttrs, UserDoc } from './user.model';

const signUp = async (data: UserAttrs): Promise<UserDoc> => {
  const user = User.build(data);
  await user.save();
  return user;
};

const exists = async (email: string): Promise<UserDoc | null> => {
  const user = await User.findOne({email});
  return user;
}

export default { signUp, exists };
