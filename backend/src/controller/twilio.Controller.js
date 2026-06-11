import twilio from "twilio";



import redis from "../db/redis.js";

const allowedChannels = new Set(["sms", "call", "whatsapp"]);

function getTwilioConfig() {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
    TWILI_SID,
  } = process.env;
  const serviceSid = TWILIO_VERIFY_SERVICE_SID || TWILI_SID;

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    TWILIO_AUTH_TOKEN === "your_twilio_auth_token_here" ||
    !serviceSid
  ) {
    const error = new Error("Twilio environment variables are missing");
    error.statusCode = 500;
    throw error;
  }

  return {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
    serviceSid,
  };
}

function getDestination(body) {
  return body?.to || body?.phone;
}

async function saveVerificationStatus(destination, payload) {
  try {
    await redis.set(
      `twilio:verify:${destination}`,
      JSON.stringify(payload),
      "EX",
      600
    );
  } catch (error) {
    console.warn("Redis OTP cache skipped:", error.message);
  }
}

export async function sendPhoneVerification(req, res) {
  try {
    const destination = getDestination(req.body);
    const channel = req.body?.channel || "sms";

    if (!destination || !destination.startsWith("+")) {
      return res.status(400).json({
        message: "Phone number must include country code, example +919289186945",
      });
    }

    if (!allowedChannels.has(channel)) {
      return res.status(400).json({
        message: "Channel must be sms, call, or whatsapp",
      });
    }

    const { accountSid, authToken, serviceSid } = getTwilioConfig();
    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: destination,
        channel,
      });

    await saveVerificationStatus(destination, {
      sid: verification.sid,
      status: verification.status,
      channel,
    });

    return res.status(200).json({
      message: "Verification sent",
      sid: verification.sid,
      status: verification.status,
    });
  } catch (error) {
    return res.status(error.statusCode || error.status || 500).json({
      message: error.message,
    });
  }
}

export async function checkPhoneVerification(req, res) {
  try {
    const destination = getDestination(req.body);
    const code = req.body?.code || req.body?.otp;

    if (!destination || !destination.startsWith("+")) {
      return res.status(400).json({
        message: "Phone number must include country code, example +919289186945",
      });
    }

    if (!code) {
      return res.status(400).json({
        message: "OTP code is required",
      });
    }

    const { accountSid, authToken, serviceSid } = getTwilioConfig();
    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: destination,
        code,
      });

    await saveVerificationStatus(destination, {
      sid: verificationCheck.sid,
      status: verificationCheck.status,
    });

    return res.status(200).json({
      message:
        verificationCheck.status === "approved"
          ? "Phone verified"
          : "Invalid or expired OTP",
      status: verificationCheck.status,
      valid: verificationCheck.status === "approved",
    });
  } catch (error) {
    return res.status(error.statusCode || error.status || 500).json({
      message: error.message,
    });
  }
}
