import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log(user.data)
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage(data.message || "Login successful");
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
            <h1 style={styles.title}>Admin Login</h1>
            <p style={styles.subtitle}>Sign in to manage your Instagram clone.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            autoComplete="current-password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {error ? <p style={styles.error}>{error}</p> : null}
          {message ? <p style={styles.success}>{message}</p> : null}

          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
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
    background: "#f6f7fb",
    boxSizing: "border-box",
  },
  panel: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    border: "1px solid #e6e8ee",
    borderRadius: "8px",
    background: "#ffffff",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
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
    background: "#111827",
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
};
