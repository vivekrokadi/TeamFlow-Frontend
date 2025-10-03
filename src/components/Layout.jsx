import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-lg font-bold text-white">TeamFlow</span>
            </div>
            
            {/* Spacer to balance the layout */}
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;