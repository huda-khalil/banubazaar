export const isAdminAuthenticated = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const expiry = localStorage.getItem("adminExpiry");

  if (!isAdmin || !expiry) return false;

  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");
    return false;
  }

  return true;
};

export const logout = () => {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminExpiry");
};
