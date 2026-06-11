import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import { verifyEmailTransporter } from "./src/config/email.js";

dotenv.config();

verifyEmailTransporter();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
