import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGEL_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

export async function verifyEmailTransporter() {
  if (!process.env.EMAIL_USER || !process.env.REFRESH_TOKEN) {
    return;
  }

  transporter.verify((error) => {
    if (error) {
      console.error("Error connecting to email server:", error.message);
    } else {
      console.log("Email server is ready to send messages");
    }
  });
}

export async function sendEmail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: `"Instagram Clone" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}

export default sendEmail;
