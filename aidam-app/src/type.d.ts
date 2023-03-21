interface User {
  _id: string;
  name: string;
  email: number;
  password: string;
  license: number;
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

