import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function register(name, email, password) {
  try {
    const res = await api.post("/register", {
      name,
      email,
      password,
    });

    console.log("Registration successful");
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

async function login(email, password) {
  try {
    const res = await api.post("/login", {
        email,
        password,
    });

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    if (res.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    console.log("Login successful");
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function getMe() {
  try {
    const res = await api.get("/get-me");
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

async function logout() {
  try {
    const res = await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return res.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

export { api, getMe, login, logout, register };
