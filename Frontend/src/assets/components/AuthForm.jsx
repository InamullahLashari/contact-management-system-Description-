// import React from "react";
// import { Link } from "react-router-dom";

// const AuthForm = ({ isLogin, formData, handleChange, handleSubmit }) => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-8">
//       <div className="relative z-10 w-full max-w-md">
//         <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800">

//           {/* Header */}
//           <div className="p-8 pb-6" >
//             <h1 className="text-center text-2xl font-bold text-orange-400">
//               {isLogin ? "Logiin" : "SiignUp"}
//             </h1>

//             {/* Toggle buttons (same place) */}
//             <div className="flex mb-8 bg-gray-800 rounded-xl p-1 mt-6">
//               <Link
//                 to="/"
//                 className={`flex-1 py-3 text-center rounded-lg font-semibold ${
//                   isLogin
//                     ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
//                     : "text-gray-400"
//                 }`}
//               >
//                 Login
//               </Link>

//               <Link
//                 to="/Signup"
//                 className={`flex-1 py-3 text-center rounded-lg font-semibold ${
//                   !isLogin
//                     ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
//                     : "text-gray-400"
//                 }`}
//               >
//                 Sign Up
//               </Link>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {!isLogin && (
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white"
//                   required
//                 />
//               )}

//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white"
//                 required
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white"
//                 required
//               />

//               {!isLogin && (
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-gray-800 rounded-xl text-white"
//                   required
//                 />
//               )}

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-semibold"
//               >
//                 {isLogin ? "Login" : "Create Account"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;

import React, { useState } from "react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-end w-full h-screen bg-gray-800 pr-4">
      {/* <div className="flex items-center justify-center w-full h-screen bg-gray-800 px-4 p-0"> */}




      <div className="w-full max-w-md  bg-gary-900 rounded-2xl shadow-lg p-7 mr-14">
        {/* Header */}
        <h1 className="text-center text-2xl font-bold text-orange-400">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
      

        {/* Toggle */}
        <div className="flex mt-6 mb-6 bg-gray-700 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl font-semibold ${isLogin
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                : "text-gray-300"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl font-semibold ${!isLogin
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                : "text-gray-300"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form (UI only) */}
        <div className="space-y-4">
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
            />
          )}
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white"
            />
          )}
          <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-semibold">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </div>


      </div>
    </div>
  );
};

export default AuthForm;
