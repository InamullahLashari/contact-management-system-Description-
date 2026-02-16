import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthForm = ({ isLogin, formData, handleChange, handleSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-800">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-7">
        <h1 className="text-center text-2xl font-bold text-orange-400">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-orange-400 hover:text-orange-300"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-semibold ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-center text-gray-400 mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a
              href={isLogin ? "/signup" : "/"}
              className="text-orange-400 hover:text-orange-300"
            >
              {isLogin ? "Sign Up" : "Login"}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
