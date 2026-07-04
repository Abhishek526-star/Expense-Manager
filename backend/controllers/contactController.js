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

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    console.log("Starting sendMail...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Finance Tracker Feedback: ${subject}`,
      html: `
        <h2>New Feedback</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    console.log("Mail sent:", info);

    res.status(200).json({
      success: true,
      message: "Feedback Sent Successfully",
    });
  } catch (err) {
    console.error("sendMail Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};