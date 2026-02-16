import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../assets/components/AuthForm/AuthForm";
import Toast from "../../Toast/Toast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Update form state on input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle user already exists
      if (data.message?.toLowerCase().includes("user already signup")) {
        setToast({ message: "User already signed up with this email", type: "error" });
      }
      // Handle other server errors
      else if (!response.ok) {
        setToast({ message: data.message || "Signup failed. Please try again.", type: "error" });
      }
      // Signup success
      else {
        setToast({ message: "Signup successful! Please login.", type: "success" });
        setTimeout(() => {
          setToast(null);
          navigate("/"); // redirect after 1.5s
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      // Network/server down
      setToast({ message: "Server Down. Please try later.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Inline validation errors */}
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-700/20 p-2 rounded">
          {error}
        </p>
      )}

      {/* Toast messages */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Signup form */}
      <AuthForm
        isLogin={false}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default Signup;
