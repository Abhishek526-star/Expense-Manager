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

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: `Finance Tracker Feedback : ${subject}`,

            html: `
                <h2>New Feedback</h2>

                <p><b>Name :</b> ${name}</p>

                <p><b>Email :</b> ${email}</p>

                <p><b>Subject :</b> ${subject}</p>

                <p><b>Message :</b></p>

                <p>${message}</p>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Feedback Sent Successfully",
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Unable to send Feedback",
        });

    }

};