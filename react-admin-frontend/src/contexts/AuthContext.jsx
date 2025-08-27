import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setError(null);
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
      // Don't set error for unauthenticated users
      if (error.status !== 401) {
        setError("Failed to check authentication status");
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      await apiService.login({ email, password });
      await checkAuth();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      const errors = error.response?.data?.errors || {
        general: [errorMessage],
      };
      setError(errorMessage);
      return { success: false, errors };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log("🚀 Registration starting...");
      console.log("🎯 Target URL:", import.meta.env.VITE_API_BASE_URL);

      setError(null);
      const result = await apiService.register(userData);

      console.log("✅ Registration successful:", result);
      await checkAuth();
      return { success: true };
    } catch (error) {
      console.error("❌ Registration failed:", error);
      console.error("📋 Full error:", error.response?.data);

      const errorMessage =
        error.response?.data?.message || "Registration failed";
      const errors = error.response?.data?.errors || {
        general: [errorMessage],
      };

      setError(errorMessage);
      return { success: false, errors };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await apiService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      console.error("Logout failed:", error);
      return { success: false, error: "Logout failed" };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const updatedUser = await apiService.updateProfile(profileData);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return {
        success: false,
        errors: error.response?.data?.errors || { general: [errorMessage] },
      };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await apiService.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password change failed";
      setError(errorMessage);
      return {
        success: false,
        errors: error.response?.data?.errors || { general: [errorMessage] },
      };
    }
  };

  // Initialize authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
