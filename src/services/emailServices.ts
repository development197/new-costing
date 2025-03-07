import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'superdolphins.com', // e.g., 'mail.yourdomain.com'
    port: 465, // SSL port
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'info@superdolphins.com', // Your full email address (e.g., 'info@yourdomain.com')
      pass: 'yv*l!MU%akkh', // The email password
    },
  });