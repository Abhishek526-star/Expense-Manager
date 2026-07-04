import transporter from "../config/mail.js";

export const sendContactMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log("=== Contact Request ===");
    console.log(req.body);

    console.log("BREVO_LOGIN:", process.env.BREVO_LOGIN);
    console.log("BREVO_SMTP_KEY exists:", !!process.env.BREVO_SMTP_KEY);

    console.log("Starting sendMail...");

  const info = await transporter.sendMail({
  from: '"Finance Tracker" <tesla.339187@gmail.com>', // Your verified sender
  to: process.env.RECEIVER_EMAIL,                     // Your inbox
  replyTo: email,                                    // User's email
  subject: `Finance Tracker Feedback: ${subject}`,
  html: `
    <h2>New Feedback</h2>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
});

    console.log("Mail sent:", info);

    return res.status(200).json({
      success: true,
      message: "Feedback sent successfully",
    });
  } catch (err) {
    console.error("sendMail Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};