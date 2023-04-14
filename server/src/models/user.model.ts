import mongoose from 'mongoose';
import { Password } from '../services/password';

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  license: string;
  profession: string;
  phone: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  license: string;
  profession: string;
  phone: number;
  admin: boolean;
  lastThreeTasks: [String];
  lastLoginDate: Date;
  observationsId: string[];
  patientsId: string[];
  history: [];
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  observationsId: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Observation' },
  ],
  patientsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  history: [
    {
      type: String,
      default: [],
    },
  ],
  status: {
    type: Boolean,
    default: false,
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
