import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const ADMIN_PASSWORD = "banubazaar2025";

  const handleLogin = (e) => {
    e.preventDefault(); // ✅ THIS MUST BE FIRST

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("❌ Incorrect password");
      setPassword("");
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter password..."
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
