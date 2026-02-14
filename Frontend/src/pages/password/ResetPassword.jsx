import React, { useState } from "react";
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle visibility of password fields
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { oldPassword, newPassword, confirmPassword } = formData;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      // Send as form data
      const formBody = new URLSearchParams({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      await api.post("/auth/reset-password", formBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setSuccess("Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Close modal after 1.5 seconds
      setTimeout(onClose, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Password change failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl text-orange-400 text-center mb-4">
          Change Password
        </h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Old Password */}
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              name="oldPassword"
              placeholder="Current password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 rounded-xl text-white disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
