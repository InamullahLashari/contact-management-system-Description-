import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../assets/components/AuthForm/AuthForm";
import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle input changes
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

      // Navigate based on role
      if (role === "ROLE_ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Login succeeded but tokens not received");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Login failed. Check email/password."
    );
  } finally {
    setIsLoading(false);
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
        isLoading={isLoading} // pass loading state if you want to disable the button inside AuthForm
      />
    </>
  );
};

export default Login;
