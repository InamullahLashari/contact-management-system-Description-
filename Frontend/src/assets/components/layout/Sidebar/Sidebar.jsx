import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Dashboard" },
    { path: "/contacts", label: "Contacts" },
    { path: "/groups", label: "Groups" },
    { path: "/profile", label: "Profile" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-[calc(100vh-4rem)] shadow-xl">
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300">Navigation</h2>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;