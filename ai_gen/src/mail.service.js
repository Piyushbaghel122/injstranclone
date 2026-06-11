import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})

function assertEmailEnv() {
    const requiredEnv = [
        "GOOGLE_USER",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REFRESH_TOKEN",
    ];

    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    if (missingEnv.length > 0) {
        throw new Error(`Missing email env values: ${missingEnv.join(", ")}`);
    }
}

export async function verifyEmailTransporter() {
    assertEmailEnv();
    await transporter.verify();
    console.log("Email transporter is ready to send emails");
}

export async function sendEmail({ to, subject, html, text = "" }) {
    try {
        assertEmailEnv();

        const details = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text,
        });

        console.log("Email sent:", details.messageId);
        return "email sent successfully, to " + to;
    } catch (error) {
        const authHint = error.code === "EAUTH"
            ? "Gmail OAuth failed. Check GOOGLE_USER, refresh token, client id, and client secret are from the same Google OAuth app/account."
            : error.message;

        console.error("Error sending email:", authHint);
        return authHint;
    }
}
