import React, { useEffect, useState } from "react";
import { Users, Folder, MoreVertical } from "lucide-react";

const DashboardContent = () => {
  const [userName, setUserName] = useState("User");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8082/auth/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(`${data.firstName} ${data.lastName}`);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUser();
  }, []);

  const stats = [
    { title: "Total Contacts", value: "1247", change: "+12.5%", trend: "up", icon: Users, color: "from-blue-500 to-cyan-400" },
    { title: "Active Groups", value: "18", change: "+3 new", trend: "up", icon: Folder, color: "from-purple-500 to-pink-400" },
  ];

  const recentContacts = [
    { id: 1, name: "Alex Johnson", email: "alex.j@company.com", role: "Product Manager", avatarColor: "bg-gradient-to-r from-blue-500 to-cyan-400", status: "active" },
    { id: 2, name: "Sarah Williams", email: "sarah.w@design.com", role: "UI/UX Designer", avatarColor: "bg-gradient-to-r from-purple-500 to-pink-400", status: "active" },
    { id: 3, name: "Michael Chen", email: "m.chen@tech.com", role: "Software Engineer", avatarColor: "bg-gradient-to-r from-green-500 to-emerald-400", status: "away" },
    { id: 4, name: "Emma Davis", email: "emma.d@marketing.com", role: "Marketing Head", avatarColor: "bg-gradient-to-r from-orange-500 to-yellow-400", status: "active" },
    { id: 5, name: "David Wilson", email: "d.wilson@sales.com", role: "Sales Director", avatarColor: "bg-gradient-to-r from-red-500 to-pink-400", status: "busy" },
    { id: 6, name: "Lisa Brown", email: "lisa.b@hr.com", role: "HR Manager", avatarColor: "bg-gradient-to-r from-indigo-500 to-purple-400", status: "active" },
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Here's what's happening with your contacts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/30 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <span className={`text-sm ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contacts */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Contacts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
          {recentContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center p-3 bg-gray-800/40 hover:bg-gray-800/70 rounded-xl transition-all group"
            >
              <div className={`w-12 h-12 ${contact.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                {contact.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{contact.name}</p>
                  <span className={`w-2 h-2 rounded-full ${contact.status === 'active' ? 'bg-green-400' : contact.status === 'away' ? 'bg-yellow-400' : 'bg-red-400'}`}></span>
                </div>
                <p className="text-sm text-gray-400">{contact.role}</p>
                <p className="text-xs text-gray-500">{contact.email}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
