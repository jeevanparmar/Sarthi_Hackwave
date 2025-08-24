import { Link } from "react-router-dom";
import { LayoutDashboard, Play, FileText, Database, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-2">AI Agent</h1>
      <p className="text-sm text-gray-500 mb-6">Supply Chain Security</p>

      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link to="/simulations" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <Play size={18} />
          <span>Simulations</span>
        </Link>

        <Link to="/risk-reports" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <FileText size={18} />
          <span>Risk Reports</span>
        </Link>

        <Link to="/data-integrations" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <Database size={18} />
          <span>Data Integrations</span>
        </Link>

        <Link to="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
