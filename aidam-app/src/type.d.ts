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
  profileImg: string;
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
  certificate: string[];
  reports: string[];
  medicalReports: string[];
  socialReports: string[];
  cud: string;
  adress: string;
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
  cud: string;
  adress: string;
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
  cud: string;
  adress: string;
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

interface IunassignProfResponse {
  patient: Patient;
  profName: INames;
}
interface IunassignPatientResponse {
  user: User;
  patientName: INames;
}

interface DividedReports {
  half1: string[];
  half2: string[];
}

interface MedicalFormData {
  date1: string;
  motivoConsulta: string;
  antecedentesFamiliares: string;
  oea: string;
  tamizMetabólico: string;
  factoresNegativos: string;
  evaluacionesComplementarias: string;
  alimentacion: string;
  sueño: string;
  motricidadGruesa: string;
  motricidadFina: string;
  controlEsfinteres: string;
  temperamento: string;
  antecedentesPatologicos: string;
  trayectoriaEscolar: string;
  desarrolloSocial: string;
  desarrolloComunicativo: string;
  situacionEstresante: string;
  factoresRiesgo: string;
  peso: string;
  talla: string;
  ta: string;
  imcapt: string;
  perimetroCefalico: string;
  exploracionFisica: string;
  examenesPrevios: string;
  pruebasEstandarizadas: string;
  dateA: string;
  audicion: string;
  dateB: string;
  vision: string;
  dateC: string;
  procesamientoSensorial: string;
  dateD: string;
  evaluacionMotora: string;
  dateE: string;
  dateF: string;
  evalNeurocognitiva: string;
  evalNeurolinguistica: string;
  diagnostico: string;
  sugerenciasTerapeuticas: string;
}