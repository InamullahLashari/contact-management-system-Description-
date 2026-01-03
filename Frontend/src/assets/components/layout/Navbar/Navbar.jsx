import React, { useState, useEffect } from "react";
import { NavLink, useNavigate,} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  //const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  // Listen for storage events
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === "authToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Quick action handlers
  const handleAddContact = () => {
    navigate("/contacts/new");
  };

  const handleSearch = () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleImportContacts = () => {
    // Trigger file input for import
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.json,.vcf";
    fileInput.onchange = (e) => {
      console.log("File selected for import:", e.target.files[0]);
      // Add import logic here
    };
    fileInput.click();
  };

  const handleExportContacts = () => {
    console.log("Exporting contacts...");
    // Add export logic here
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm text-white shadow-2xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <NavLink
              to={isAuthenticated ? "/contacts" : "/"}
              className="flex items-center space-x-3 group"
            >
              <div className="w-9 h-9 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Contact<span className="text-white">Pro</span>
              </h1>
            </NavLink>

            {/* Navigation Links (Only when authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <NavLink
                  to="/contacts"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`
                  }
                >
                  Contacts
                </NavLink>
                <NavLink
                  to="/groups"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`
                  }
                >
                  Groups
                </NavLink>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`
                  }
                >
                  Analytics
                </NavLink>
              </div>
            )}
          </div>

          {/* Center Section - Search Bar (Only when authenticated) */}
          {isAuthenticated && (
            <div className="flex-1 max-w-md mx-4 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="searchInput"
                  type="search"
                  placeholder="Search contacts, groups, or tags..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>
          )}

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Quick Action Buttons */}
                <button
                  onClick={handleSearch}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 lg:hidden"
                  title="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <button
                  onClick={handleImportContacts}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                  title="Import Contacts"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span className="hidden lg:inline">Import</span>
                </button>

                <button
                  onClick={handleExportContacts}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                  title="Export Contacts"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden lg:inline">Export</span>
                </button>

                {/* Add Contact Button */}
                <button
                  onClick={handleAddContact}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Add Contact</span>
                  <span className="sm:hidden">Add</span>
                </button>

                {/* User Profile & Logout */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">U</span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-800">
                      <p className="text-sm font-medium">User Account</p>
                      <p className="text-xs text-gray-400">admin@contactpro.com</p>
                    </div>
                    <div className="p-2">
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                        Settings
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition mt-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Not authenticated - Show login/signup buttons
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;