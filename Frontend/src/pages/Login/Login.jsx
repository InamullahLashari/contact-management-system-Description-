import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../assets/components/AuthForm/AuthForm";
import Toast from '../../Toast/Toast';

import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("auth/login", formData);
      const { tokens, role, status } = response.data;
      const { accessToken, refreshToken } = tokens;

      if (status === "success" && accessToken && refreshToken) {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("role", role);

        if (role === "ROLE_ADMIN") navigate("/admin-dashboard");
        else navigate("/dashboard");
      } else {
        setToast({ message: "Login succeeded but tokens not received", type: "error" });
      }

    } catch (err) {
      console.error(err);

      if (!err.response) {
        // Server unreachable
        setToast({ message: "Server Down. Please try later.", type: "error" });
      } else if (err.response.status === 401) {
        // Unauthorized = invalid credentials
        setToast({ message: "Invalid email or password.", type: "error" });
      } else {
        setToast({
          message: err.response.data?.message || "Login failed. Check email/password.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-700/20 p-2 rounded">
          {error}
        </p>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AuthForm
        isLogin={true}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default Login;
