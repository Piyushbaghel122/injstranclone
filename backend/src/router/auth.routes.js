import express from "express";
import {
  forgotPassword,
  getMeController,
  googleCallbackController,
  googleLoginController,
  loginController,
  logoutController,
  logoutRegisterController,
  phoneController,
  registerController,
} from "../controller/auth.Controller.js";
import { createLocation,getLocations} from "../controller/loction.Controller.js";
import { checkPhoneVerification , sendPhoneVerification} from "../controller/twilio.Controller.js";
import { followUserController , unfollowUserController } from "../controller/follow.Controller.js";
import { getFeedController } from "../controller/post.Controller.js";
import { identifyUser } from "../middleware/autth.middleware.js";
import {
  handleValidationErrors,
  loginValidation,
  normalizeRegisterInput,
  registerValidation,
} from "../validators/auth.validator.js";

const routerAuth = express.Router();

routerAuth.post(
  "/register",
  normalizeRegisterInput,
  registerValidation,
  handleValidationErrors,
  registerController
);
routerAuth.post("/login", loginValidation, handleValidationErrors, loginController);
routerAuth.get("/google", googleLoginController);
routerAuth.get("/google/callback", googleCallbackController);
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

routerAuth.post("/follow/:username",identifyUser  , followUserController );
routerAuth.post("/unfollow/:username" , identifyUser , unfollowUserController);

routerAuth.get("/feed", identifyUser, getFeedController);
routerAuth.get("/get-me/:userId", identifyUser, getMeController);

export default routerAuth;
