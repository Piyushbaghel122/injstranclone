import dotenv from "dotenv";
import sendEmail from "./email.js";

dotenv.config();

await sendEmail(
  "recipient@example.com",
  "Test Email Subject",
  "This is a test email sent with Nodemailer using OAuth2.",
  "<p>This is a test email sent with <b>Nodemailer</b> using OAuth2.</p>"
);
