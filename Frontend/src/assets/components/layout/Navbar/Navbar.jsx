import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  Plus,
  ChevronDown,
  LogOut,
  Users,
} from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  const [filters, setFilters] = useState({
    sortBy: "firstName",
    sortDir: "asc",
  });

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Fetch user data after login
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:8082/auth/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          setUserName(`${firstName} ${lastName}`);
          setUserInitials(
            `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearchFilters = (query, currentFilters) => {
    const searchData = { query, filters: currentFilters };
    localStorage.setItem("contactSearchFilters", JSON.stringify(searchData));
    window.dispatchEvent(new Event("contactFiltersChanged"));
  };

  const handleSearchWithDebounce = (value, currentFilters) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (
        value.trim() ||
        currentFilters.sortBy !== "firstName" ||
        currentFilters.sortDir !== "asc"
      ) {
        saveSearchFilters(value, currentFilters);
      } else {
        clearFilters();
      }
    }, 500);
  };

  const hasActiveFilters = () => {
    return (
      searchQuery.trim() || filters.sortBy !== "firstName" || filters.sortDir !== "asc"
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearchWithDebounce(value, filters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (searchQuery.trim() || hasActiveFilters()) {
      saveSearchFilters(searchQuery, filters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearchSubmit(e);
  };

  const handleAddContact = () => navigate("/dashboard/contactlist?action=add");

  const handleLogout = () => {
    // Remove session storage items
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("contactSearchFilters");

    // Clear any timeout if set
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Redirect to home page
    navigate("/");
};


  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    if (searchQuery.trim() || newFilters.sortBy !== "firstName" || newFilters.sortDir !== "asc") {
      saveSearchFilters(searchQuery, newFilters);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ sortBy: "firstName", sortDir: "asc" });
    localStorage.removeItem("contactSearchFilters");
    window.dispatchEvent(new Event("contactFiltersChanged"));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                ContactHub
              </h1>
              <p className="text-xs text-gray-400">Professional Contact Management</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex-1 max-w-3xl mx-8 flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder="Search contacts, emails, or phone numbers..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-800/50 rounded-full p-1"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </form>

            {/* Filter */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                  hasActiveFilters()
                    ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500 text-orange-400"
                    : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filter
                {hasActiveFilters() && <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full"></span>}
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 p-4">
                  {/* Sort Options */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Sort Options</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sort By</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFilterChange("sortBy", "firstName")}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            filters.sortBy === "firstName"
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          First Name
                        </button>
                        <button
                          onClick={() => handleFilterChange("sortBy", "lastName")}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            filters.sortBy === "lastName"
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          Last Name
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Order</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFilterChange("sortDir", "asc")}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                            filters.sortDir === "asc"
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          ASC ↑
                        </button>
                        <button
                          onClick={() => handleFilterChange("sortDir", "desc")}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                            filters.sortDir === "desc"
                              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          DESC ↓
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFilterMenuOpen(false)}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg mt-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddContact}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-white">{userInitials}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{userName}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">{userName}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
