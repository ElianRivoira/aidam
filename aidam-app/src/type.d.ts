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

interface IFamily {
  id: number;
  name: string;
  relationship: string;
  age: string;
  civilState: string;
  ocupation: string;
  health: string;
  observations: string;
  [key: string];
}

interface ILivingGroup {
  nameLink: string;
  incomeSource: string;
  employmentStability: string;
  daysOfWork: string;
  incomeAmount: string;
  [key: string];
}

interface ISocialSecurity {
  checked: boolean;
  whoCollectsIt: string;
  obs: string;
  amount: string;
  [key: string];
}

interface IComunitaryCast {
  institution: string;
  referent: string;
  contact: string;
  obs: string;
  [key: string];
}

interface SocialFormData {
  date1: string;
  socialWorkAccess: string;
  cud: string;
  nextExpiration: string;
  interviewed: string;
  phone: string;
  familyGroup: IFamily[];
  socialNetwork: IFamily[];
  familyGenogram: string;
  obsFamilyType: string;
  homeOwner: string;
  homePossession: string;
  homePossessionExtra: string;
  wallsMaterial: string;
  roofMaterial: string;
  floorMaterial: string;
  bathAmount: string;
  bathFlushing: string;
  bathFlushingExtra: string;
  bathAdapted: string;
  services: {
    Luz: string;
    Agua: string;
    Gas: string;
    Cloacas: string;
    [key: string]: string;
  };
  bedRoomsAmount: string;
  whereAndWhoSleep: string;
  enviroment: string;
  obsAmbient: string;
  socialSecurity: {
    AUH: ISocialSecurity;
    AUHD: ISocialSecurity;
    SUAF: ISocialSecurity;
    PNC: ISocialSecurity;
    [key: string]: ISocialSecurity;
  };
  employmentSituation: ILivingGroup[];
  obsSocioeconomic: string;
  comunitaryCast: IComunitaryCast[];
  obsLinkageNetMap: string;
  comunicWithInstit: string;
  attendsInterviews: string;
  obsFamilyParticipation: string;
  personalCaretaker: string;
  personalCaretakerName: string;
  personalCaretakerWhy: string;
  whoBathedHim: string;
  restTime: string;
  eatTime: string;
  medicsTime: string;
  haveAccessQualityFood: string;
  shareEatTimeWithFamily: string;
  howOrganizeBuyPrepareFood: string;
  comunication: string;
  interests: string;
  expectationsOfInstitution: string;
  previousTreatments: string;
  barriersOnInclusion: string;
  obsRoutine: string;
  professionalConclusion: string;
}

interface IDataToMapInputs {
  name: string;
  label: string;
  width: string;
  [key: string];
}

type setterType = {
  [name: string]: boolean;
};

interface PhysiatricFormData {
  reportDate: string;
  embarazoValues: setterType;
  embarazoOptional: string;
  partoValues: setterType;
  recienNacido: setterType;
  recienNacidoOptional: string;
  hitosDeDesarrollo: {
    name: string;
    value: number;
  }[];
  complementario: setterType;
  cirugia: string;
  conducta: setterType;
  conductaOptional: string;
  lenguaje: setterType;
  lenguajeOptional: string;
  vision: setterType;
  visionOptional: string;
  audicion: setterType;
  audicionOptional: string;
  comprension: setterType;
  esfinteres: setterType;
  alimentacion: setterType;
  alimentacionOptional: string;
  sueño: setterType;
  sueñoOptional: string;
  primaria: setterType;
  secundaria: setterType;
  adaptacion: setterType;
  lectoEscritura: setterType;
  obsLectoescritura: string;
  diagEtiologico: string;
  diagFuncional: string;
  gmfcs: string;
  marcha: setterType;
  equipamiento: setterType;
  fim: string;
  barthel: string;
  otraEscala: string;
  medActual: string;
  inter: string;
  objectives: string;
  observations: string;
}