import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Use sessionStorage now
  const token = sessionStorage.getItem("token");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the protected content
  return children;
};

export default ProtectedRoute;
