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
