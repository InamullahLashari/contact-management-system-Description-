import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ForgotPasswordFlow = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validator
  const isPasswordStrong = (password) => {
    const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
    return pattern.test(password);
  };

  // ---------------- Step 1: Send OTP ----------------
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!email) return setError("Email is required");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8082/auth/forgot-password?email=${email}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => res.text());
      if (!res.ok) throw new Error(data.message || data || "Failed to send OTP");

      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 2: Verify OTP ----------------
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!otp) return setError("OTP is required");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8082/auth/verify-otp?email=${email}&otp=${otp}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => res.text());
      if (!res.ok) throw new Error(data.message || data || "Failed to verify OTP");

      setMessage("OTP verified! Please set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 3: Reset Password ----------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (!newPassword || !confirmPassword) return setError("Both password fields are required");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (!isPasswordStrong(newPassword))
      return setError("Password must be 8+ chars, with uppercase, lowercase, number & special char");

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8082/auth/reset-password-otp?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`,
        { method: "POST" }
      );

      const data = await res.json().catch(() => res.text());
      if (!res.ok) throw new Error(data.message || data || "Failed to reset password");

      // Clear sensitive data
      setEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword("");

      // Redirect immediately to login
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-6 rounded-xl w-96">

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2 className="text-xl text-orange-400 text-center mb-4">Enter Your Email</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-500 mb-2">{message}</p>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white mb-4"
            />

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 rounded-xl text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {/* Direct Login Button */}
            <button
              type="button"
              className="w-full py-3 mt-2 border border-orange-500 rounded-xl text-orange-400 bg-transparent hover:bg-orange-500 hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <h2 className="text-xl text-orange-400 text-center mb-4">Enter OTP</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-500 mb-2">{message}</p>}

            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white mb-4"
            />

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 rounded-xl text-white"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Direct Login Button */}
            <button
              type="button"
              className="w-full py-3 mt-2 border border-orange-500 rounded-xl text-orange-400 bg-transparent hover:bg-orange-500 hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-xl text-orange-400 text-center mb-4">Reset Password</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-500 mb-2">{message}</p>}

            {/* New Password */}
            <div className="relative mb-2">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Password rules */}
            <p className="text-gray-400 text-sm mb-4">
              Password must be 8+ chars, include uppercase, lowercase, number & special char
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 rounded-xl text-white"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Direct Login Button */}
            <button
              type="button"
              className="w-full py-3 mt-2 border border-orange-500 rounded-xl text-orange-400 bg-transparent hover:bg-orange-500 hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
