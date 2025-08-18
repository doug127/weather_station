import nodemailer from 'nodemailer';

const generateCode = () =>  Math.floor(100000 + Math.random() * 900000);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS
  }
});

export const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
