import multer from 'multer';
import path from 'path';
import { BadRequestError } from '../errors/bad-request-error';

const CERT_DIR = path.join(__dirname, '../../certificates');
const MIMETYPES = ['application/pdf', 'application/msword'];

export const uploadCertificate = multer({
  storage: multer.diskStorage({
    destination: CERT_DIR,
    filename: (req, file, cb) => {
      const { firstName, lastName, dni } = req.body;
      const date = new Date().toLocaleString().split(',')[0].replaceAll('/', '-');
      const fileExtension = path.extname(file.originalname);
      const fileName = `${firstName}-${lastName}-${dni}-${date}`
      cb(null, `${fileName}${fileExtension}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestError(`Solo se permiten archivos de tipo "PDF"`))
  },
});
