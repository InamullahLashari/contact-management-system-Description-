import React, { useState } from "react";
import api from "../../api/axios";

const AccountDeleteModal = ({ onClose }) => {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    try {
      setLoading(true);
      await api.delete("/auth/user");
      
      // Redirect to home page after successful deletion
      window.location.href = "/";
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
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

        <h2 className="text-xl text-red-500 text-center mb-4">
          Delete Account
        </h2>

        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              <span className="font-bold">Warning:</span> This action is permanent and cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          <p className="text-gray-300">
            Please type <span className="font-mono font-bold text-orange-400">DELETE</span> to confirm:
          </p>

          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 rounded-xl text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmation !== "DELETE"}
              className="flex-1 py-3 bg-red-600 rounded-xl text-white disabled:opacity-50 hover:bg-red-700 transition-colors"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeleteModal;