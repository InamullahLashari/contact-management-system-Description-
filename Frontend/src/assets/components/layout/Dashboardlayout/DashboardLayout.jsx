import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar at top */}
        <Navbar />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* Nested routes render here */}
        </main>

        {/* Optional Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
