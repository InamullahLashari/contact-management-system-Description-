import React from "react";

const AuthForm = ({ isLogin, formData, handleChange, handleSubmit }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-800">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-7">
        <h1 className="text-center text-2xl font-bold text-orange-400">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          {/* Name field only for signup */}
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />

          {/* Forgot password – ONLY on login */}
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
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-semibold"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {/* Switch between login & signup */}
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
