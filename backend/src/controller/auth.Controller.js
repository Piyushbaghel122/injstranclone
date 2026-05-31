import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authModel from "../models/auth.models.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function sendTokenResponse(res, statusCode, message, user) {
  const token = createToken(user);

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
    },
    token,
  });
}

export async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existUser = await authModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await authModel.create({
      name,
      email,
      password: hash,
    });

    return sendTokenResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    return res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
}

function sendLogoutResponse(res) {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    message: "Logout successful",
  });
}

export async function logoutRegisterController(req, res) {
  return sendLogoutResponse(res);
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return sendTokenResponse(res, 200, "Login successful", user);
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
}

export async function logoutController(req, res) {
  return sendLogoutResponse(res);
}

export async function phoneController(req, res) {
  try {
    const { phone, country } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const existUser = await authModel.findOne({ phone });
    if (existUser) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }

    const user = await authModel.create({
      phone,
      country,
    });

    return sendTokenResponse(res, 201, "Phone user created successfully", user);
  } catch (error) {
    return res.status(500).json({
      message: "Phone user create failed",
      error: error.message,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return res.status(200).json({
      message: "Reset password token created",
      resetUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Forgot password failed",
      error: error.message,
    });
  }
}
