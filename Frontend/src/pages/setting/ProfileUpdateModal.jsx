import React, { useState, useEffect } from "react";
import api from "../../api/axios";

const ProfileUpdateModal = ({ onClose, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/user/profile");
        setFormData(response.data);
      } catch (err) {
        setError("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put("/auth/user/profile", formData);
      
      setSuccess("Profile updated successfully!");
      if (onProfileUpdate) {
        onProfileUpdate(response.data);
      }
      
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
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
          Update Profile
        </h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-3 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 rounded-xl text-white disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;