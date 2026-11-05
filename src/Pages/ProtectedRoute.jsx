import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem("adminUser") || "null");
  } catch {
    admin = null;
  }

  if (!token || admin?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
