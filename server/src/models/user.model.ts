import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  license: string;
  profession: string;
  phone: number;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  license: string;
  profession: string;
  phone: number;
  admin: boolean;
  observationsId: [];
  patientsId: [];
  history: [];
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  license: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  observationsId: {
    type: Array,
    default: [],
  },
  patientsId: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
