import mongoose, { Schema } from 'mongoose';
import { UserDoc } from './user.model';
import { ObservationDoc } from './observations.model';

export interface PatientAttrs {
  name: string;
  diagnosis: string;
  authorizedModule: string;
  socialwork: string;
  affiliateNumber: string;
  dni: number;
  birth: Date;
  email: string;
  phone: number;
}

interface PatientModel extends mongoose.Model<PatientDoc> {
  build(attrs: PatientAttrs): PatientDoc;
}

export interface PatientDoc extends mongoose.Document {
  name: string;
  diagnosis: string;
  socialwork: string;
  affiliateNumber: string;
  authorizedModule: string;
  dni: number;
  birth: Date;
  email: string;
  phone: number;
  schedulesId: Array<string>;
  observationsId: Array<ObservationDoc['_id']>;
  professionalsId: Array<UserDoc['_id']>;
}

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  socialwork: {
    type: String,
    required: true,
  },
  affiliateNumber: {
    type: String,
    required: true,
  },
  authorizedModule: {
    type: String,
    required: true,
  },
  dni: {
    type: Number,
    required: true,
  },
  birth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  schedulesId: {
    type: Array,
  },
  observationsId: [{ type: Schema.Types.ObjectId, ref: 'Observation' }],
  professionalsId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

patientSchema.statics.build = (attrs: PatientAttrs) => {
  return new Patient(attrs);
};

const Patient = mongoose.model<PatientDoc, PatientModel>(
  'Patient',
  patientSchema
);

export default Patient;
