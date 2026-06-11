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

function getGoogleCallbackUrl() {
  return process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";
}

function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGEL_CLIENT_SECRET;
}

export async function googleLoginController(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getGoogleCallbackUrl();

  if (!clientId) {
    return res.status(500).json({ message: "GOOGLE_CLIENT_ID is missing" });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

export async function googleCallbackController(req, res) {
  try {
    const { code } = req.query;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = getGoogleClientSecret();
    const redirectUri = getGoogleCallbackUrl();

    if (!code) {
      return res.status(400).json({ message: "Google authorization code is missing" });
    }

    if (!clientId || !clientSecret) {
      return res.status(500).json({ message: "Google OAuth credentials are missing" });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({
        message: "Google token exchange failed",
        error: tokenData.error_description || tokenData.error,
      });
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      return res.status(400).json({
        message: "Google profile fetch failed",
        error: profile.error?.message || "Email not found",
      });
    }

    let user = await authModel.findOne({ email: profile.email });

    if (!user) {
      user = await authModel.create({
        name: profile.name,
        email: profile.email,
        profileImage: profile.picture,
      });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/feed`);
  } catch (error) {
    return res.status(500).json({
      message: "Google login failed",
      error: error.message,
    });
  }
}

export async function registerController(req, res) {
  try {
    const { email, password } = req.body;
    const name = req.body.name || req.body.username;

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

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
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
        message: "wrong email or password",
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

user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

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

export async function getMeController(req, res) {
   try{
  
    const userId = req.user.id;
    const user = await authModel
      .findById(userId)
      .select("-password -resetPasswordToken -resetPasswordExpire");

    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
      },
    })
   }catch(error){
    return res.status(500).json({
      message: "Get me failed",
      error: error.message,
    });
   }
}
