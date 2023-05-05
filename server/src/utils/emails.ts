const nodemailer = require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const send = (options: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aidamterapeuticomendoza@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOption = {
    ...options,
    from: "'AIDAM CENTRO TERAPÉUTICO' aidamterapeuticomendoza@gmail.com",
  };

  transporter.sendMail(mailOption, (err: Error) => {
    if (err) {
      console.error('Error sending mail', err);
    }
  });
};

const sendPasswordChangerEmail = (email: string, link: string) => {
  const mailOptions = {
    to: email,
    subject: 'Password change request',
    text: 'Password change',
    html: `
    <p>To follow the password change process click in the link below</p>
    <a href='${link}'>Change password</a>`,
  };
  send(mailOptions);
};

export { sendPasswordChangerEmail };
