interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  license: string;
  profession: string;
  phone?: string;
  admin: false;
  observationsId: Observation[];
  patientsId: Patient[];
  lastThreeTasks: [];
  status: boolean;
  lastLoginDate: Date;
}

interface FormUser {
  firstName: string;
  lastName: string;
  email: string;
  license: string;
  profession: string;
  phone: string;
  [key: string]: string;
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
  professional: User;
}

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
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
  professionalsId: User[];
  active: boolean;
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
  [key: string]: string;
}

interface INames {
  firstName1: string;
  firstName2?: string;
  lastName1: string;
  lastName2?: string;
}

interface TokenResponse {
  status: boolean;
  message?: string;
  email?: string;
}
