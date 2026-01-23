import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../assets/components/AuthForm";
import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await api.post("auth/login", formData);

      if (response.data.tokens?.accessToken && response.data.tokens?.refreshToken) {
        localStorage.setItem("token", response.data.tokens.accessToken);
        localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        navigate("/dashboard"); // redirect after login
      } else {
        setError("Login succeeded but tokens not received");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Check email/password."
      );
    }
  };

  return (
    <>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <AuthForm
        isLogin={true}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Login;
