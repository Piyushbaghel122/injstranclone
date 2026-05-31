import express from "express";
import {
  forgotPassword,
  loginController,
  logoutController,
  logoutRegisterController,
  phoneController,
  registerController,
} from "../controller/auth.Controller.js";
import {
  createLocation,
  getLocations,
} from "../controller/loction.Controller.js";
import {
  checkPhoneVerification,
  sendPhoneVerification,
} from "../controller/twilio.Controller.js";

const routerAuth = express.Router();

routerAuth.post("/register", registerController);
routerAuth.post("/login", loginController);
routerAuth.post("/logout", logoutController);
routerAuth.post("/phone-user", phoneController);
routerAuth.post("/forgot-password", forgotPassword);
routerAuth.post("/location", createLocation);
routerAuth.get("/location", getLocations);
routerAuth.post("/register/logout", logoutRegisterController);

routerAuth.post("/phone", sendPhoneVerification);
routerAuth.post("/send-otp", sendPhoneVerification);
routerAuth.post("/otp", checkPhoneVerification);
routerAuth.post("/opt", checkPhoneVerification);

export default routerAuth;
