interface PostUser {
  name: string;
  email: string;
  phone: number;
  profession: string;
  license: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  profession: string;
  license: string;
  phone: number;
  admin: boolean;
  _id: string;
  // observationsId: [];
  // patientsId: [];
  // history: [];
}

interface CustomError {
  message: string;
}