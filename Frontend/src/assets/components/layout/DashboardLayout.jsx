import React from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar stays at top */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main section */}
        <main className="flex-1 p-6 overflow-hidden bg-gray-950

">
          <Outlet /> {/* Nested routes render here */}
        </main>
      </div>

     
    </div>
  );
};

export default DashboardLayout;
