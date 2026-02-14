import React, { useEffect, useState } from "react";
import { Users, Folder, MoreVertical } from "lucide-react";

const DashboardContent = () => {
  const [userName, setUserName] = useState("User");

  // Contacts
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);

  // Groups
  const [totalGroups, setTotalGroups] = useState(0);

  // Loading states
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Decode JWT token to get username
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name = payload.name || `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
      setUserName(name || "User");
    } catch (err) {
      console.error("Invalid token", err);
      setUserName("User");
    }
  }, []);

  // Fetch only 6 recent contacts - no pagination
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoadingContacts(true);
    fetch(`http://localhost:8082/contact/list?page=0&size=6`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setTotalContacts(data.totalItems || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingContacts(false));
  }, []);

  // Fetch total groups
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    setLoadingGroups(true);
    fetch("http://localhost:8082/group", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const groupsCount = data.data?.totalGroups || data.data?.groups?.length || 0;
        setTotalGroups(groupsCount);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingGroups(false));
  }, []);

  const stats = [
    {
      title: "Total Contacts",
      value: totalContacts.toLocaleString(),
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      iconColor: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
    {
      title: "Active Groups",
      value: totalGroups.toLocaleString(),
      icon: Folder,
      bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      iconColor: "bg-gradient-to-r from-purple-500 to-pink-400",
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {`Welcome back, ${userName}! 👋`}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Manage your contacts and groups efficiently
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isLoading = stat.title === "Total Contacts" ? loadingContacts : loadingGroups;
          return (
            <div
              key={index}
              className={`${stat.bgColor} border border-gray-800 rounded-2xl p-6 flex justify-between items-center backdrop-blur-sm`}
            >
              <div>
                <p className="text-sm text-gray-300 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
              <div
                className={`w-16 h-16 rounded-xl ${stat.iconColor} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contacts */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Contacts</h2>
            <p className="text-sm text-gray-400">
              Your 6 most recent contacts
            </p>
          </div>
        </div>

        {loadingContacts ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-3 text-gray-400">Loading contacts...</p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contacts found</p>
              <p className="text-sm text-gray-500 mt-1">Add your first contact to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contacts.slice(0, 6).map((contact) => (
              <div
                key={contact.id}
                className="bg-gray-800/40 hover:bg-gray-800/70 rounded-xl p-4 transition-all duration-200 border border-gray-700/50 hover:border-gray-600 group"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-blue-500/30 to-purple-500/30">
                    {contact.firstName?.charAt(0) || "?"}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {contact.title && (
                      <p className="text-sm text-gray-400 truncate mt-1">{contact.title}</p>
                    )}
                    {contact.emails && contact.emails[0]?.emailAddress && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {contact.emails[0].emailAddress}
                      </p>
                    )}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
