import React from "react";
import { Bell, Settings, User } from "lucide-react";

const TopNavbar = () => {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex justify-between items-center ">
      {/* Left side - Title */}
      <h1 className="text-xl font-semibold text-gray-800"></h1>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <User className="h-6 w-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Jeevan</span>
        </div>
      </div>
    </header>
  );
};


export default TopNavbar;
