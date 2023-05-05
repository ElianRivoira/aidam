import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';

const CERT_DIR = path.join(__dirname, '../../certificates');
const PROFILE_IMG_DIR = path.join(__dirname, '../../profilesImgs');
const CERT_MIMETYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const IMG_MIMETYPES = ['image/jpeg', 'image/svg+xml', 'image/png'];

export const uploadCertificate = multer({
  storage: multer.diskStorage({
    destination: CERT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, dni } = req.body;
      const date = new Date()
        .toLocaleString()
        .split(',')[0]
        .replaceAll('/', '-');
      const fileExtension = path.extname(file.originalname);
      const fileName = `${firstName}-${lastName}-${dni}-${date}`;
      cb(null, `${fileName}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (CERT_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestError(`Solo se permiten archivos de tipo "PDF" y "DOC/DOCX"`));
  },
});

export const uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: PROFILE_IMG_DIR,
    filename: (req, file, cb) => {
      console.log(req.body)
      const { firstName, lastName, license } = req.body;
      const fileExtension = path.extname(file.originalname);
      const fileName = `${firstName}-${lastName}-${license}`;
      console.log('procesando imagen')
      cb(null, `${fileName}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (IMG_MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestError(`Solo se permiten imágenes de tipo "JPG", "JPEG" y "SVG"`));
  },
});
