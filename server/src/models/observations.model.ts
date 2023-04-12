import mongoose from 'mongoose';
import { UserDoc } from './user.model';

// An interface that describes the properties
// that are requried to create a new Observation
export interface ObservationAttrs {
  title: string;
  observation: string;
  date: Date;
  professional: string;
  patient: string;
}

// An interface that describes the properties
// that a Observation Model has
interface ObservationModel extends mongoose.Model<ObservationDoc> {
  build(attrs: ObservationAttrs): ObservationDoc;
}

// An interface that describes the properties
// that a Observation Document has
export interface ObservationDoc extends mongoose.Document {
  title: string;
  observation: string;
  date: Date;
  professional: UserDoc['_id'];
}

const ObservationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  observation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
});

ObservationSchema.statics.build = (attrs: ObservationAttrs) => {
  return new Observation(attrs);
};

const Observation = mongoose.model<ObservationDoc, ObservationModel>('Observation', ObservationSchema);

export default Observation;