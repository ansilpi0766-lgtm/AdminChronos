import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#F8F5EF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
