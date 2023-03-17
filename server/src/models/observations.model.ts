import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Observation
export interface ObservationAttrs {
  title: string;
  observation: string;
  professional: string;
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
  professional: string;
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
  },
  professional: {
    type: String,
    required: true,
  },
});

ObservationSchema.pre('save', async function (done) {
  this.set('date', new Date());
  done();
});

ObservationSchema.statics.build = (attrs: ObservationAttrs) => {
  return new Observation(attrs);
};

const Observation = mongoose.model<ObservationDoc, ObservationModel>('Observation', ObservationSchema);

export default Observation;