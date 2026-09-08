import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if admin is logged in
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // If not logged in, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If logged in, render the children (Admin component)
  return children;
}
