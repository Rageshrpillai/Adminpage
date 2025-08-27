import React, { useState } from "react";
import apiService from "../services/apiService";

const CSRFDebug = () => {
  const [status, setStatus] = useState("");
  const [cookies, setCookies] = useState("");
  const [loading, setLoading] = useState(false);

  const testCSRF = async () => {
    setLoading(true);
    setStatus("Testing CSRF flow...");

    try {
      // Step 1: Get CSRF token
      console.log("🔄 Getting CSRF token...");
      await apiService.get("/sanctum/csrf-cookie");

      // Step 2: Check cookies
      const allCookies = document.cookie;
      setCookies(allCookies);

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="));

      const laravelSession = document.cookie
        .split("; ")
        .find((row) => row.startsWith("laravel_session="));

      console.log("🍪 All cookies:", allCookies);
      console.log("🔑 XSRF-TOKEN:", xsrfToken ? "Found" : "Missing");
      console.log("📝 Laravel Session:", laravelSession ? "Found" : "Missing");

      if (!xsrfToken) {
        setStatus("❌ XSRF-TOKEN cookie not set. Check domain configuration.");
        setLoading(false);
        return;
      }

      // Step 3: Test POST request with dummy data
      try {
        await apiService.post("/register", {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          password_confirmation: "password123",
        });
        setStatus(
          "✅ CSRF working! (May get validation errors, that's normal)"
        );
      } catch (error) {
        if (error.response?.status === 419) {
          setStatus("❌ CSRF token mismatch (419 error)");
          console.error("🚨 CSRF Error Details:", error.response);
        } else if (error.response?.status === 422) {
          setStatus(
            "✅ CSRF working! Got validation errors (expected for test data)"
          );
        } else {
          setStatus(`❌ Error: ${error.response?.status || error.message}`);
        }
      }
    } catch (error) {
      setStatus(`❌ Network error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">🔍 CSRF Debug Tool</h3>

      <div className="space-y-2 mb-4 text-sm">
        <p>
          <strong>Frontend URL:</strong> {window.location.origin}
        </p>
        <p>
          <strong>Backend URL:</strong> https://admindashboard.test
        </p>
        <p>
          <strong>API Base:</strong>{" "}
          {import.meta.env.VITE_API_BASE_URL || "https://admindashboard.test"}
        </p>
      </div>

      <button
        onClick={testCSRF}
        disabled={loading}
        className={`px-4 py-2 rounded text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Testing..." : "Test CSRF Flow"}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-white border rounded">
          <strong>Status:</strong> {status}
        </div>
      )}

      {cookies && (
        <div className="mt-4">
          <strong>Cookies Found:</strong>
          <pre className="mt-2 p-3 bg-gray-100 text-xs rounded overflow-x-auto">
            {cookies || "No cookies found"}
          </pre>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        <strong>Common Issues:</strong>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>No XSRF-TOKEN cookie: Domain mismatch or SESSION_DOMAIN wrong</li>
          <li>
            419 CSRF error: Frontend domain not in SANCTUM_STATEFUL_DOMAINS
          </li>
          <li>Network errors: Backend not running or CORS misconfigured</li>
        </ul>
      </div>
    </div>
  );
};

export default CSRFDebug;
