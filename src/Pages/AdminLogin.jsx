import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const passwordRef = useRef(null); // ✅ Use ref to read the password
  const [loading, setLoading] = useState(false);
  const ADMIN_PASSWORD = "banubazaar2025";

  // ✅ Clear the input field when the page loads
  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const password = passwordRef.current?.value || ""; // ✅ Read from ref

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      await navigate("/admin"); // ✅ Wait for navigation
      //   navigate("/admin");
    } else {
      setError("❌ Incorrect password");
      if (passwordRef.current) {
        passwordRef.current.value = ""; // ✅ Clear the input
        passwordRef.current.focus(); // ✅ Focus for retry
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-600">🛍️ BanuBazaar</h1>
          <p className="text-gray-500 text-sm">Admin Login</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Admin Password
            </label>
            <input
              ref={passwordRef} // ✅ Use ref instead of state
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter password..."
              disabled={loading} // ✅ Disable while loading
              autoFocus
              autoComplete="new-password" // ✅ Prevents browser autofill
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading} // ✅ Disable while loading
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
