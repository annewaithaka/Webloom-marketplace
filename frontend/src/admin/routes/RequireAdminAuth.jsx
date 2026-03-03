import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken } from "../../lib/api.js";

export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = getAdminToken();
  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
