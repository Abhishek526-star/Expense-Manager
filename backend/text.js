import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: '"Finance Tracker" <tesla.339187@gmail.com>', // Verified sender
      to: process.env.RECEIVER_EMAIL,                     // Your email
      replyTo: "abhishekkumar63871@gmail.com",            // User's email
      subject: "Brevo Test Email",
      html: `
        <h2>Test Email</h2>

        <p><strong>Name:</strong> Abhishek Kumar</p>
        <p><strong>Email:</strong> abhishekkumar63871@gmail.com</p>
        <p><strong>Subject:</strong> Brevo Test</p>

        <hr>

        <p>Hello! This email was sent using Brevo SMTP.</p>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log(info);
  } catch (err) {
    console.error("❌ Error:");
    console.error(err);
  }
}

testMail();