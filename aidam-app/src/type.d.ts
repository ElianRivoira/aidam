interface User {
  _id: string;
  name: string;
  email: number;
  password: string;
  license: number;
  profession: string;
  phone?: string;
  admin: false;
  observationsId: [];
  patientsId: [];
  history: [];
}

interface PostUser {
  name: string;
  email: string;
  phone: number;
  profession: string;
  license: string;
  password: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
}

interface CustomError {
  message: string;
}

interface PostObservation {
  title: string;
  observation: string;
  date: Date;
  patientId: string;
}

interface PutObservation {
  id: string;
  text: string;
}

interface DeleteObservation {
  patientId: string;
  obsId: string;
}

interface Observation {
  _id: string;
  title: string;
  observation: string;
  date: Date;
  professional: string | User;
}

interface Patient {
  _id: string;
  name: string;
  diagnosis: string;
  socialwork: string;
  affiliateNumber: string;
  authorizedModule: string;
  dni: number;
  birth: Date;
  email: string;
  phone: number;
  schedulesId: [];
  observationsId: Observation[];
  professionalsId: []
}