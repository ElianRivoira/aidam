interface User {
  _id: string;
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
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

interface PostPatient {
  firstName: string;
  lastName: string;
  dni: number;
  birth: Date;
  socialwork: string;
  affiliateNumber: string;
  authorizedModule: string;
  diagnosis: string;
  email: string;
  phone: number;
}

interface FormPatient {
  firstName: string;
  lastName: string;
  dni: string;
  birth: string;
  socialwork: string;
  affiliateNumber: string;
  authorizedModule: string;
  diagnosis: string;
  email: string;
  phone: string;
  [key: string]: string
}