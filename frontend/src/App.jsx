import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Simulations from "./pages/Simulations";
import RiskReports from "./pages/RiskReports";
import DataIntegrations from "./pages/DataIntegrations";
import Settings from "./pages/Settings";

function App() {
  return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/risk-reports" element={<RiskReports />} />
            <Route path="/data-integrations" element={<DataIntegrations />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
