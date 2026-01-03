import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Login Page</h1>
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
