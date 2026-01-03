import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/contacts", label: "Contacts", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { path: "/groups", label: "Groups", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A6 6 0 016 21v-1a6 6 0 013-5.197" },
    { path: "/profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { path: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-sm text-white min-h-[calc(100vh-4rem)] shadow-2xl border-r border-gray-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Contact Manager
            </h1>
            <p className="text-xs text-gray-400">Professional Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white border-l-4 border-orange-500 shadow-md"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`
              }
            >
              <div className={`p-2 rounded-lg ${item.path === "/" ? "bg-orange-500/20" : "bg-gray-800"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="font-medium">{item.label}</span>
              {item.path === "/contacts" && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">12</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-800"></div>

        {/* Quick Stats */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Total Contacts</span>
              <span className="font-bold text-yellow-400">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Groups</span>
              <span className="font-bold text-orange-400">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Today's Adds</span>
              <span className="font-bold text-green-400">+5</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-8">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="text-center text-xs text-gray-500">
            <p>Contact Manager v1.0</p>
            <p className="mt-1">Secure by design</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;