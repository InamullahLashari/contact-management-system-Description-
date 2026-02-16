import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${colors[type]}`}
      style={{ zIndex: 9999 }}
    >
      {/* Optional icons */}
      {type === "success" && <span>✅</span>}
      {type === "error" && <span>❌</span>}
      {type === "info" && <span>ℹ️</span>}
      {type === "warning" && <span>⚠️</span>}

      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-3 font-bold hover:opacity-80"
      >
        ✖
      </button>
    </div>
  );
};

export default Toast;
