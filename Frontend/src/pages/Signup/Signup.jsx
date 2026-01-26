import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../assets/components/AuthForm";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",       // Full name
    email: "",
    password: "",   // Only one password field
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    try {
      // Prepare data for backend
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      console.log("Sending signup data:", signupData);

      // Send request to backend
      const response = await fetch("http://localhost:8082/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);

      alert("Signup successful! Please login.");
      navigate("/"); // Redirect to login page
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <AuthForm
        isLogin={false}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Signup;
