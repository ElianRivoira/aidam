import User, { UserDoc } from '../models/user.model';

export const searchUsers = async (wordsNumber: number, splittedName: string[]) => {
  let findedUsers: UserDoc[];
  switch (wordsNumber) {
    case 1:
      findedUsers = await User.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          { status: true },
        ],
      }).sort({ lastName: 1 });
      return findedUsers;
      break;
    case 2:
      findedUsers = await User.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
            ],
          },
          { status: true },
        ],
      }).sort({ lastName: 1 });
      return findedUsers;
      break;
    case 3:
      findedUsers = await User.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
            ],
          },
          { status: true },
        ],
      }).sort({ lastName: 1 });
      return findedUsers;
      break;
    case 4:
      findedUsers = await User.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[1]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[2]}.*`, $options: 'i' } },
            ],
          },
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[3]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[3]}.*`, $options: 'i' } },
            ],
          },
          { status: true },
        ],
      }).sort({ lastName: 1 });
      return findedUsers;
      break;
    default:
      findedUsers = await User.find({
        $and: [
          {
            $or: [
              { firstName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
              { lastName: { $regex: `.*${splittedName[0]}.*`, $options: 'i' } },
            ],
          },
          { status: true },
        ],
      }).sort({ lastName: 1 });
      return findedUsers;
      break;
  }
};
