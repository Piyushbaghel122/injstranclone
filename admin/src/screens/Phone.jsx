import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+1", label: "USA" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "UAE" },
  { code: "+977", label: "Nepal" },
];

export default function Phone() {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const phoneDigits = phone.replace(/\D/g, "");
  const fullPhone = `${countryCode}${phoneDigits}`;
  const isPhoneValid = /^\+[1-9]\d{7,14}$/.test(fullPhone);
  const phoneHint = phone
    ? isPhoneValid
      ? `Phone number ready: ${fullPhone}`
      : "Enter a valid phone number"
    : "Choose country code and enter phone number";

  function handlePhoneChange(event) {
    setPhone(event.target.value.replace(/\D/g, ""));
    setError("");
    setMessage("");
    setOtpSent(false);
    setOtp("");
  }

  function handleCountryChange(event) {
    setCountryCode(event.target.value);
    setError("");
    setMessage("");
    setOtpSent(false);
    setOtp("");
  }

  async function sendOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isPhoneValid) {
      setError("Choose country code and enter a valid phone number");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: fullPhone,
          channel: "sms",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP send failed");
      }

      setOtpSent(true);
      setMessage(data.message || "OTP sent successfully");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSending(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isPhoneValid) {
      setError("Choose country code and enter a valid phone number before verifying OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: fullPhone,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.valid === false) {
        throw new Error(data.message || "Invalid OTP");
      }

      setMessage(data.message || "Phone verified");
      setOtp("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <div style={styles.brand}>
          <span style={styles.logo}>I</span>
          <div>
            <h1 style={styles.title}>Phone OTP</h1>
            <p style={styles.subtitle}>Verify a phone number with SMS OTP.</p>
          </div>
        </div>

        <form onSubmit={sendOtp} style={styles.form}>
          <label style={styles.label} htmlFor="phone">
            Phone number
          </label>
          <div style={styles.phoneRow}>
            <select
              aria-label="Country code"
              value={countryCode}
              onChange={handleCountryChange}
              style={styles.select}
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} {country.label}
                </option>
              ))}
            </select>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              placeholder="9289186945"
              value={phone}
              onChange={handlePhoneChange}
              required
              style={{
                ...styles.input,
                borderColor: phone && !isPhoneValid ? "#f97316" : "#cbd5e1",
              }}
            />
          </div>
          <p style={isPhoneValid ? styles.liveSuccess : styles.hint}>
            {phoneHint}
            {phoneDigits ? ` (${phoneDigits.length} digits)` : ""}
          </p>

          <button
            type="submit"
            disabled={isSending || !isPhoneValid}
            style={{
              ...styles.button,
              opacity: isSending || !isPhoneValid ? 0.65 : 1,
              cursor: isSending || !isPhoneValid ? "not-allowed" : "pointer",
            }}
          >
            {isSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        </form>

        {otpSent ? (
          <form onSubmit={verifyOtp} style={styles.otpForm}>
            <label style={styles.label} htmlFor="otp">
              OTP code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
              style={styles.input}
            />

            <button
              type="submit"
              disabled={isVerifying || !otp.trim()}
              style={{
                ...styles.verifyButton,
                opacity: isVerifying || !otp.trim() ? 0.65 : 1,
                cursor: isVerifying || !otp.trim() ? "not-allowed" : "pointer",
              }}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        ) : null}

        {error ? (
          <p style={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p style={styles.success} aria-live="polite">
            {message}
          </p>
        ) : null}

        <p style={styles.footerText}>
          Use email instead? <Link to="/register" style={styles.link}>Register</Link>
        </p>
        <p style={styles.footerText}>
          Already have account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100svh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "linear-gradient(135deg, #eef6ff 0%, #f8fbf5 48%, #fff4ed 100%)",
    boxSizing: "border-box",
  },
  panel: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    border: "1px solid rgba(148, 163, 184, 0.32)",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.94)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
    boxSizing: "border-box",
    textAlign: "left",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px",
  },
  logo: {
    width: "44px",
    height: "44px",
    display: "grid",
    placeItems: "center",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 700,
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
    lineHeight: 1.1,
    letterSpacing: 0,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  otpForm: {
    display: "grid",
    gap: "12px",
    marginTop: "18px",
  },
  label: {
    color: "#334155",
    fontSize: "14px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    color: "#111827",
    background: "#ffffff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  phoneRow: {
    display: "grid",
    gridTemplateColumns: "132px 1fr",
    gap: "10px",
  },
  select: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 8px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    color: "#111827",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  hint: {
    margin: "-4px 0 0",
    color: "#f97316",
    fontSize: "13px",
  },
  liveSuccess: {
    margin: "-4px 0 0",
    color: "#15803d",
    fontSize: "13px",
  },
  button: {
    width: "100%",
    minHeight: "44px",
    marginTop: "8px",
    border: 0,
    borderRadius: "6px",
    color: "#ffffff",
    background: "#2563eb",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
  verifyButton: {
    width: "100%",
    minHeight: "44px",
    marginTop: "8px",
    border: 0,
    borderRadius: "6px",
    color: "#ffffff",
    background: "#16a34a",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    margin: "14px 0 0",
    color: "#dc2626",
    fontSize: "14px",
  },
  success: {
    margin: "14px 0 0",
    color: "#15803d",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "18px",
    color: "#64748b",
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "none",
  },
};
