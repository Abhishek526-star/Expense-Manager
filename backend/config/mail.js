import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  connectionTimeout: 20000, // Wait 20 seconds for a connection to establish
  greetingTimeout: 20000,   // Wait 20 seconds for the greeting
  socketTimeout: 30000, 
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export default transporter;