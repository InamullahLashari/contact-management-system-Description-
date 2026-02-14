import React, { useState, useEffect } from "react";
import { User, Key, Trash } from "lucide-react";
import ResetPasswordModal from "../password/ResetPassword";
import AccountDeleteModal from "./AccountDelete";

// Utility to parse JWT
const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "-",
    email: "-"
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "resetPassword", name: "Reset Password", icon: Key },
    { id: "accountDelete", name: "Delete Account", icon: Trash }
  ];

  // Load profile from JWT token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      setProfileData({
        name: payload?.name || "-",
        email: payload?.sub || "-"
      });
    }
  }, []);

  return (
    <div className="min-h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Full Name</p>
              <p className="text-white text-lg">{profileData.name}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Email Address</p>
              <p className="text-white text-lg">{profileData.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Tab */}
      {activeTab === "resetPassword" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Reset Password
          </h2>
          <p className="text-gray-400 mb-6">
            Change your password to keep your account secure.
          </p>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Change Password
          </button>
        </div>
      )}

      {/* Account Delete Tab */}
      {activeTab === "accountDelete" && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Delete Account
          </h2>
          <p className="text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      )}

      {/* Modals */}
      {showResetModal && (
        <ResetPasswordModal onClose={() => setShowResetModal(false)} />
      )}

      {showDeleteModal && (
        <AccountDeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
};

export default Settings;
