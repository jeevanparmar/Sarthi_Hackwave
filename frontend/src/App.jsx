import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// 🔹 import Navbar & Footer

import Dashboard from "./pages/Dashboard";
import Simulations from "./pages/Simulations";
import RiskReports from "./pages/RiskReports";
import DataIntegrations from "./pages/DataIntegrations";
import Settings from "./pages/Settings";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";

function App() {
  return (
    
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* 🔹 Top Navbar */}
          <TopNavbar />

          {/* 🔹 Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulations" element={<Simulations />} />
              <Route path="/risk-reports" element={<RiskReports />} />
              <Route path="/data-integrations" element={<DataIntegrations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          {/* 🔹 Footer */}
          <Footer />
        </div>
      </div>
  
  );
}

export default App;
