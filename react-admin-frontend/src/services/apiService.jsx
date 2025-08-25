// API Service for Laravel Backend Communication
class ApiService {
  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || "https://admindashboard.test";
    this.defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  // Generic HTTP request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      credentials: "include", // Important for Sanctum cookies
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Convert body to JSON string if it's an object
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          response: { data },
        };
      }

      return data;
    } catch (error) {
      // Network or parsing errors
      if (error.response) {
        throw error;
      }
      throw {
        status: 0,
        statusText: "Network Error",
        response: {
          data: { errors: { general: ["Network connection failed"] } },
        },
      };
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Authentication Methods
  async initializeCSRF() {
    try {
      await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("CSRF initialization failed:", error);
      throw error;
    }
  }

  async login(credentials) {
    await this.initializeCSRF();
    return this.post("/login", credentials);
  }

  async register(userData) {
    await this.initializeCSRF();
    return this.post("/register", userData);
  }

  async logout() {
    return this.post("/logout");
  }

  async getCurrentUser() {
    return this.get("/api/user");
  }

  async forgotPassword(email) {
    await this.initializeCSRF();
    return this.post("/forgot-password", { email });
  }

  async resetPassword(data) {
    await this.initializeCSRF();
    return this.post("/reset-password", data);
  }

  // Additional API methods can be added here
  async updateProfile(userData) {
    return this.put("/api/user/profile", userData);
  }

  async changePassword(passwordData) {
    return this.put("/api/user/password", passwordData);
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
