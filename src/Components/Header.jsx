import React from "react";
import { Bell, Search, UserCircle } from "lucide-react";

const Header = () => {
  const admin = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <header className="h-[80px] bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#421713]">
          Welcome to CHRONOS
        </h2>
        <p className="text-sm text-gray-500">Manage your luxury store</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-[#421713]">
          <Search size={20} />
        </button>

        <button className="relative text-gray-500 hover:text-[#421713]">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={32} className="text-[#421713]" />
          <div>
            <p className="text-sm font-semibold text-[#421713]">
              {admin.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
