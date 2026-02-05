import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Folder, Activity, User, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/contactlist", label: "ContactList", icon: Users },
    { path: "/dashboard/groups", label: "Groups", icon: Folder },
    { path: "/dashboard/activities", label: "Activities", icon: Activity },
    { path: "/dashboard/profile", label: "Profile", icon: User },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-sm text-white shadow-2xl border-r border-gray-800 h-screen flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Contact Hub
            </h1>
            <p className="text-xs text-gray-400">Professional Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white border-l-4 border-orange-500 shadow-md"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`
                }
              >
                <div className={`p-2 rounded-lg ${item.path === "/dashboard" ? "bg-orange-500/20" : "bg-gray-800"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;