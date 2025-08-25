// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SimulationResults from '../components/SimulationResults';
import axios from "axios";

export default function Dashboard() {
  // Dummy state data
  const [riskData, setRiskData] = useState({
  });

  const [trendData, setTrendData] = useState([]);

  const [mapData] = useState([
    {
      country: "Nepal",
      lat: 28.3949,
      lng: 84.1240,
      risk: "Medium Risk",
    },
    {
      country: "Germany",
      lat: 51.1657,
      lng: 10.4515,
      risk: "Low Risk",
    },
    {
      country: "Japan",
      lat: 36.2048,
      lng: 138.2529,
      risk: "High Risk",
    },
    {
      country: "Sri Lanka",
      lat: 7.8731,
      lng: 80.7718,
      risk: "Low Risk",
    },
    {
      country: "USA",
      lat: 37.0902,
      lng: -95.7129,
      risk: "High Risk",
    },
    {
      country: "China",
      lat: 35.8617,
      lng: 104.1954,
      risk: "Medium Risk",
    },
  ]);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/dashboard");
      console.log("Dashboard data:", response.data);

      const apiData = response.data;

      // ✅ set riskData directly
      setRiskData({
        supplierRisk: apiData.supplierRisk,
        transportDelays: apiData.transportDelays,
        PredictedMaterial: apiData.PredictedMaterial,
        PredictedLoss: apiData.PredictedLoss,
      });

      // ✅ set trendData directly
      setTrendData(apiData.trendData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
            <p className="text-gray-500">
              Today Real-time vulnerability monitoring and assessment
            </p>
          </div>
          <p className="text-sm text-gray-400">Last updated</p>
        </div>
            {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(riskData).map(([key, item]) => (
            <div
              key={key}
              className="bg-white shadow rounded-xl p-4 flex flex-col gap-1"
            >
              <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
              <p
                className={`text-sm ${item.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {item.change > 0 ? `▲ ${item.change}%` : `▼ ${Math.abs(item.change)}%`}
              </p>
              <p className="text-xs text-gray-400">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Trends + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier Trend */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Supplier Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "Previous Days",
                    position: "insideBottom",
                    offset: -2,
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <YAxis
                  label={{
                    value: "Supplier Risk",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="supplier"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ef4444", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#ef4444", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transport Trend */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Transport Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "Previous Days",
                    position: "insideBottom",
                    offset: -4,
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <YAxis
                  label={{
                    value: "Delay Days",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="transport"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#f59e0b", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#f59e0b", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


          {/* Predicted Material */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Predicted Material</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "Previous Days",
                    position: "insideBottom",
                    offset: -4,
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <YAxis
                  label={{
                    value: "Predicted Material",
                    angle: -90,
                    position: "insideLeft",
                    
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="geo"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


          {/* Predicted Loss */}
          <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">Predicted Loss</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: "Previous Days",
                    position: "insideBottom",
                    offset: -5,
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <YAxis
                  label={{
                    value: "Predicted Loss",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle", fontSize: 13, fill: "#374151", fontWeight: "bold" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="climate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


          {/* Map */}
          {/* Global Supply Chain Map (takes full row, equal to 2 charts) */}
          <div className="bg-white p-4 rounded-xl shadow col-span-2">
            <h3 className="font-semibold mb-2">Global Supply Chain</h3>
            <MapContainer center={[20, 0]} zoom={2} className="h-[250px] w-full">
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapData.map((loc, idx) => (
                <CircleMarker
                  key={idx}
                  center={[loc.lat, loc.lng]}
                  radius={8}
                  pathOptions={{
                    color:
                      loc.risk === "High Risk"
                        ? "red"
                        : loc.risk === "Medium Risk"
                          ? "orange"
                          : "green",
                  }}
                >
                  <Popup>{loc.risk}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Scenario + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario */}
          {/* <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Scenario Testing</h3>
          <div className="flex gap-2 mb-4">
            {["Supplier Strike", "Port Delay", "Natural Disaster", "Cyber Attack"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    scenario === s
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
          <div className="p-3 rounded-lg bg-gray-50 text-sm">
            <p>
              <span className="font-bold">Simulated Impact:</span> {scenario}
            </p>
            <p>Revenue Impact: -$2.4M</p>
            <p>Duration: 14 days</p>
            <p>Affected Products: 23%</p>
            <p>Recovery Time: 6 weeks</p>
          </div>
        </div> */}

          {/* AI Strategy */}
          {/* <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4">
            AI Strategy Recommendations{" "}
            <span className="text-pink-500 font-bold text-xs">AI</span>
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-lg flex flex-col gap-1"
              >
                <p className="font-medium">{rec.title}</p>
                <p className="text-gray-500 text-sm">{rec.desc}</p>
                <p className="text-xs text-green-600">{rec.priority}</p>
                <p className="text-xs text-gray-400">
                  Risk Reduction: {rec.reduction}
                </p>
              </div>
            ))}
          </div>
        </div> */}
        </div>
      </div>
      {/* <SimulationResults results={dummyResults}></SimulationResults> */}
    </>
  );
}
