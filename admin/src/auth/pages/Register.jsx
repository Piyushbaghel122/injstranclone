import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Register failed");
      }

      setMessage(data.message || "Registration successful");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <div style={styles.brand}>
          <span style={styles.logo}>I</span>
          <div>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Register a new admin user.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Piyush Baghel"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {error ? <p style={styles.error}>{error}</p> : null}
          {message ? <p style={styles.success}>{message}</p> : null}

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? "Creating..." : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already registered? <Link to="/login" style={styles.link}>Login</Link>
        </p>
        <p style={styles.footerText}>
          Verify by phone? <Link to="/phone" style={styles.link}>Send OTP</Link>
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
  error: {
    margin: "4px 0 0",
    color: "#dc2626",
    fontSize: "14px",
  },
  success: {
    margin: "4px 0 0",
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
