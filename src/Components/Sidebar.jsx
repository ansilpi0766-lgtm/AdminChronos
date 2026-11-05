import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Star,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#421713] text-[#FFEDD0] flex flex-col">
      <div className="px-7 py-8 border-b border-[#743027]">
        <h1 className="text-2xl font-bold tracking-[4px]">CHRONOS</h1>
        <p className="text-xs text-[#c7a98b] mt-2 tracking-widest">
          ADMIN PANEL
        </p>
      </div>

      <nav className="flex-1 px-4 py-7 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-[#743027] text-[#F2C035]"
                    : "text-[#FFEDD0] hover:bg-[#5a241e]"
                }`
              }
            >
              <Icon size={19} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#743027]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#5a241e] text-left"
        >
          <LogOut size={19} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
