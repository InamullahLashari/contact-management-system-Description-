
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Filter,
  Plus,
  LogOut,
  Users,
} from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // 'filter' only now
  const [filters, setFilters] = useState({
    sortBy: "firstName",
    sortDir: "asc",
  });

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const filterMenuRef = useRef(null);
  const filterButtonRef = useRef(null);
  const logoutButtonRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isFilterClick = 
        filterMenuRef.current?.contains(event.target) || 
        filterButtonRef.current?.contains(event.target);
      
      const isLogoutClick = 
        logoutButtonRef.current?.contains(event.target);

      if (!isFilterClick && !isLogoutClick) {
        setOpenMenu(null);
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
      if (value.trim() || currentFilters.sortBy !== "firstName" || currentFilters.sortDir !== "asc") {
        saveSearchFilters(value, currentFilters);
      } else {
        clearFilters();
      }
    }, 500);
  };

  const hasActiveFilters = () => {
    return searchQuery.trim() || filters.sortBy !== "firstName" || filters.sortDir !== "asc";
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearchWithDebounce(value, filters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hasActiveFilters()) {
      saveSearchFilters(searchQuery, filters);
    }
  };



  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("contactSearchFilters");
    navigate("/");
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    saveSearchFilters(searchQuery, newFilters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ sortBy: "firstName", sortDir: "asc" });
    localStorage.removeItem("contactSearchFilters");
    window.dispatchEvent(new Event("contactFiltersChanged"));
  };

  const toggleFilterMenu = () => {
    setOpenMenu(openMenu === 'filter' ? null : 'filter');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 shadow-lg sticky top-0 z-50">
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
              <p className="text-xs text-gray-400">
                Professional Contact Management
              </p>
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
            <div className="relative">
              <button
                ref={filterButtonRef}
                onClick={toggleFilterMenu}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                  hasActiveFilters()
                    ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500 text-orange-400"
                    : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filter
                {hasActiveFilters() && (
                  <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </button>

              {openMenu === 'filter' && (
                <div
                  ref={filterMenuRef}
                  className="absolute left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-[9999] p-4"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Sort Options
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Sort By
                      </label>
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
                      <label className="block text-sm text-gray-400 mb-1">
                        Order
                      </label>
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Only Logout Button */}
          <div className="flex items-center space-x-4">
         

            {/* Logout Button */}
            <div className="relative">
              <button
                ref={logoutButtonRef}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;