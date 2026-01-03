import React from "react";

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h1>
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
