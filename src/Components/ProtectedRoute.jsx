import React, { useEffect } from "react";
import { isAdminAuthenticated } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const isAdmin = isAdminAuthenticated();

  useEffect(() => {
    // If not authenticated, force a full page redirect
    if (!isAdmin) {
      window.location.href = "/admin-login";
    }
  }, [isAdmin]);

  // If not authenticated, return null (prevents flash of admin content)
  if (!isAdmin) {
    return null;
  }

  return children;
}
