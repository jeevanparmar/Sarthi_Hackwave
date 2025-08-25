
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Play, FileText, Database, Settings } from "lucide-react";
import illus from '../assets/images/illus.png'; // placeholder illustration you downloaded
import { FaUserShield } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center space-x-2 rounded-lg px-3 py-2 transition ${
      isActive(path)
        ? "bg-white text-[#042c70] font-semibold shadow-sm" // active
        : "text-white hover:bg-white hover:text-[#042c70]"
    }`;

  return (
    <aside className="w-64 bg-gradient-to-r from-[#0473fb] to-[#042c70] shadow-sm p-6 flex flex-col justify-between h-screen fixed">
      {/* Top Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          {/* <img
            src={logo}
            height={30}
            width={30}
            className="text-white"
            alt="Logo"
          /> */}
          <FaUserShield  className="text-white h-8 w-8" />
          <h1 className="text-xl font-bold text-white">SupplyShield AI</h1>
        </div>
        <p className="text-base font-bold text-gray-200 mb-6">Supply Chain Security</p>

        {/* Navigation */}
        <nav className="space-y-3">
          <Link to="/" className={linkClasses("/")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link to="/simulations" className={linkClasses("/simulations")}>
            <Play size={18} />
            <span>Simulations</span>
          </Link>

          <Link to="/risk-reports" className={linkClasses("/risk-reports")}>
            <FileText size={18} />
            <span>Risk Reports</span>
          </Link>

          <Link to="/data-integrations" className={linkClasses("/data-integrations")}>
            <Database size={18} />
            <span>Detailed-Data</span>
          </Link>

          <Link to="/settings" className={linkClasses("/settings")}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Illustration Section */}
      
    </aside>
  );
};

export default Sidebar;
