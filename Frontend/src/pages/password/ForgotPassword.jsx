import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8082/auth/forgot-password?email=${email}`,
        { method: "POST" }
      );

      const data = await res.text();

      if (!res.ok) throw new Error(data);

      // ✅ store email for next step
      sessionStorage.setItem("resetEmail", email);

      // go to reset password page
      navigate("/reset-password");

    } catch (err) {
      setError(err.message || "Failed to verify email");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-96">
        <h2 className="text-xl text-orange-400 text-center mb-4">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white mb-4"
        />

        <button className="w-full py-3 bg-orange-500 rounded-xl text-white">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;