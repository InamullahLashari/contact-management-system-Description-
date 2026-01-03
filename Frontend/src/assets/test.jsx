// import React, { useState } from "react";
// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//     confirmPassword: ""
//   });
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isLogin) {
//       console.log("Login attempt:", formData.username);
//       // Handle login logic here
//     } else {
//       if (formData.password !== formData.confirmPassword) {
//         alert("Passwords don't match!");
//         return;
//       }
//       console.log("Signup attempt:", formData.email);
//       // Handle signup logic here
//     }
//   };
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-8">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>
//       <div className="relative z-10 w-full max-w-md">
//         {/* Form Container */}
//         <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
//           {/* Header */}
//           <div className="p-8 pb-6">
//             <div className="flex justify-center mb-6">
//               <div className="flex items-center space-x-2">
//                 <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">CM</span>
//                 </div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
//                   Contact Manager
//                 </h1>
//               </div>
//             </div>
//             {/* Toggle Switch */}
//             <div className="flex mb-8 bg-gray-800 rounded-xl p-1">
//               <button
//                 onClick={() => setIsLogin(true)}
//                 className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${isLogin 
//                   ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
//                   : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => setIsLogin(false)}
//                 className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${!isLogin 
//                   ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
//                   : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>
//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {!isLogin && (
//                 <div>
//                   <label className="block text-gray-300 text-sm font-medium mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
//                     required={!isLogin}
//                   />
//                 </div>
//               )}
//               <div>
//                 <label className="block text-gray-300 text-sm font-medium mb-2">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   placeholder="Enter your username"
//                   className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-300 text-sm font-medium mb-2">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
//                   required
//                 />
//               </div>
//               {!isLogin && (
//                 <div>
//                   <label className="block text-gray-300 text-sm font-medium mb-2">
//                     Confirm Password
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Confirm your password"
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
//                     required={!isLogin}
//                   />
//                 </div>
//               )}
//               {isLogin && (
//                 <div className="flex items-center justify-between">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500" />
//                     <span className="ml-2 text-gray-300 text-sm">Remember me</span>
//                   </label>
//                   <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition">
//                     Forgot password?
//                   </a>
//                 </div>
//               )}
//               <button
//                 type="submit"
//                 className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
//               >
//                 {isLogin ? 'Login to Dashboard' : 'Create Account'}
//               </button>
//             </form>
//           </div>
//           {/* Footer */}
//           <div className="px-8 py-6 bg-gray-900/50 border-t border-gray-800">
//             <div className="text-center">
//               <p className="text-gray-400 text-sm">
//                 {isLogin ? "Don't have an account? " : "Already have an account? "}
//                 <button
//                   onClick={() => setIsLogin(!isLogin)}
//                   className="text-orange-400 hover:text-orange-300 font-semibold transition"
//                 >
//                   {isLogin ? 'Sign Up' : 'Login'}
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* Demo Credentials */}
//         <div className="mt-6 text-center">
//           <p className="text-gray-500 text-sm">
//             Demo: admin / password123
//           </p>
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// };
// export default Login;

