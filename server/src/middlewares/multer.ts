import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';

const CERT_DIR = path.join(__dirname, '../../certificates');
const PROFILE_IMG_DIR = path.join(__dirname, '../../profilesImgs');
const REPORT_DIR = path.join(__dirname, '../../reports');
const MEDICAL_REPORT_DIR = path.join(__dirname, '../../medicalReports');
const SOCIAL_REPORT_DIR = path.join(__dirname, '../../socialReports');

const CERT_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const IMG_MIMETYPES = ['image/jpeg', 'image/svg+xml', 'image/png'];
const REPORT_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const FILE_SIZE = 1024 * 2048; // bytes

export const uploadCertificate = multer({
  storage: multer.diskStorage({
    destination: CERT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, dni } = req.body;
      const date = new Date()
        .toLocaleString('es-ES')
        .split(',')[0]
        .replaceAll('/', '-');
      const fileExtension = path.extname(file.originalname);
      const fileName = `${firstName}_${lastName}_${dni}_${date}`;
      cb(null, `${fileName}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (CERT_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestError(
          `Solo se permiten archivos de tipo "PDF" y "DOC/DOCX"`
        )
      );
  },
});

export const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: PROFILE_IMG_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, license } = req.body;
      const fileExtension = path.extname(file.originalname);
      const fileName = `${firstName}-${lastName}-${license}`;
      cb(null, `${fileName}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (IMG_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestError(
          `Solo se permiten imágenes de tipo "JPG", "JPEG" y "SVG"`
        )
      );
  },
});

export const uploadReport = multer({
  storage: multer.diskStorage({
    destination: REPORT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, userFirstName, userLastName, userId } = req.body
      const date = new Date()
        .toLocaleString('es-ES')
        .split(',')[0]
        .replaceAll('/', '-');
        const fileBasename = file.originalname.split('.')[0];
        const fileExtension = path.extname(file.originalname);
      cb(null, `${userId}_${firstName}-${lastName}_${fileBasename}_${userFirstName}-${userLastName}___(${date})${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (REPORT_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestError(
          `Solo se permiten archivos de tipo "PDF" y "DOC/DOCX"`
        )
      );
  },
  limits: {
    fileSize: FILE_SIZE
  }
});

export const uploadMedicalReport = multer({
  storage: multer.diskStorage({
    destination: MEDICAL_REPORT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, userFirstName, userLastName, userId } = req.body
      const date = new Date()
        .toLocaleString('es-ES')
        .split(',')[0]
        .replaceAll('/', '-');
        const fileBasename = file.originalname.split('.')[0];
        const fileExtension = path.extname(file.originalname);
      cb(null, `${userId}_${firstName}-${lastName}_${fileBasename}_${userFirstName}-${userLastName} - (${date})${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (REPORT_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestError(
          `Solo se permiten archivos de tipo "PDF" y "DOC/DOCX"`
        )
      );
  },
});

export const uploadSocialReport = multer({
  storage: multer.diskStorage({
    destination: SOCIAL_REPORT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, userFirstName, userLastName, userId } = req.body
      const date = new Date()
        .toLocaleString('es-ES')
        .split(',')[0]
        .replaceAll('/', '-');
        const fileBasename = file.originalname.split('.')[0];
        const fileExtension = path.extname(file.originalname);
      cb(null, `${userId}_${firstName}-${lastName}_${fileBasename}_${userFirstName}-${userLastName} - (${date})${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (REPORT_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new BadRequestError(
          `Solo se permiten archivos de tipo "PDF" y "DOC/DOCX"`
        )
      );
  },
});
