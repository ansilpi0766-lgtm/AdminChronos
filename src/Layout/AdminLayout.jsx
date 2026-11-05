import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F8F5EF]">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Header />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
