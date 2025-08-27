import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://admindashboard.test",
  withCredentials: true, // CRITICAL: This sends cookies with every request
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Function to get the CSRF cookie from the backend
const initializeCSRF = async () => {
  console.log("🔄 Fetching CSRF token...");
  try {
    await api.get("/sanctum/csrf-cookie");
    console.log("✅ CSRF token fetched successfully");
  } catch (error) {
    console.error("❌ CSRF initialization failed:", error);
    // Optionally handle the error, e.g., show a notification
  }
};

const apiService = {
  // Authentication Methods
  login: async (credentials) => {
    await initializeCSRF();
    return api.post("/login", credentials);
  },

  register: async (userData) => {
    await initializeCSRF();
    return api.post("/register", userData);
  },

  logout: async () => {
    return api.post("/logout");
  },

  getCurrentUser: async () => {
    return api.get("/api/user");
  },

  forgotPassword: async (email) => {
    await initializeCSRF();
    return api.post("/forgot-password", { email });
  },

  resetPassword: async (data) => {
    await initializeCSRF();
    return api.post("/reset-password", data);
  },

  // Generic Data Methods
  get: (endpoint, params = {}) => {
    return api.get(endpoint, { params });
  },

  post: (endpoint, data = {}) => {
    return api.post(endpoint, data);
  },

  put: (endpoint, data = {}) => {
    return api.put(endpoint, data);
  },

  delete: (endpoint) => {
    return api.delete(endpoint);
  },

  updateProfile: (userData) => {
    return api.put("/api/user/profile", userData);
  },

  changePassword: (passwordData) => {
    return api.put("/api/user/password", passwordData);
  },
};

export default apiService;
