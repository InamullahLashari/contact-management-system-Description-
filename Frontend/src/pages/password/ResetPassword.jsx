import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/"); // no email = invalid flow
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8082/auth/reset-password?email=${email}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`,
        { method: "POST" }
      );

      const data = await res.text();

      if (!res.ok) throw new Error(data);

      // clear stored email
      sessionStorage.removeItem("resetEmail");

      alert("Password reset successful!");
      navigate("/");

    } catch (err) {
      setError(err.message || "Reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl w-96">
        <h2 className="text-xl text-orange-400 text-center mb-4">
          Reset Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white mb-3"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white mb-4"
        />

        <button className="w-full py-3 bg-orange-500 rounded-xl text-white">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
