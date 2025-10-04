import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, User, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleLogout = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("authLogout", handleLogout);

    return () => {
      window.removeEventListener("authLogout", handleLogout);
    };
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center py-2">
                <Users className="text-white" size={22} />
              </div>
              <span className="text-lg font-bold text-white">TeamFlow</span>
            </div>

            <div className="w-10"></div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
