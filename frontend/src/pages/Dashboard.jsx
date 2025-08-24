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

export default function Dashboard() {
  // Dummy state data
  const [riskData, setRiskData] = useState({
    supplierRisk: { value: 73, change: -12, note: "3 suppliers flagged" },
    transportDelays: { value: 45, change: 8, note: "Avg delay: 2.3 days" },
    geopolitical: { value: 58, change: -5, note: "2 regions affected" },
    climateRisk: { value: 32, change: -15, note: "Low seasonal impact" },
  });

  const [trendData, setTrendData] = useState([
    { month: "Jan", supplier: 50, transport: 30, geo: 40, climate: 25 },
    { month: "Feb", supplier: 60, transport: 45, geo: 50, climate: 30 },
    { month: "Mar", supplier: 55, transport: 35, geo: 60, climate: 40 },
    { month: "Apr", supplier: 70, transport: 25, geo: 75, climate: 35 },
    { month: "May", supplier: 65, transport: 60, geo: 55, climate: 45 },
    { month: "Jun", supplier: 58, transport: 40, geo: 65, climate: 30 },
  ]);

  const [mapData] = useState([
    { lat: 40.7128, lng: -74.006, risk: "High Risk" },
    { lat: 34.0522, lng: -118.2437, risk: "Medium Risk" },
    { lat: 51.5074, lng: -0.1278, risk: "Low Risk" },
  ]);

  const [scenario, setScenario] = useState("Supplier Strike");

  const [recommendations] = useState([
    {
      title: "Diversify Supplier Base",
      desc: "Reduce dependency on single suppliers by identifying 3 alternative vendors.",
      priority: "High Priority",
      reduction: "35%",
    },
    {
      title: "Implement Buffer Inventory",
      desc: "Increase safety stock for 21-day supply.",
      priority: "Medium Priority",
      reduction: "28%",
    },
    {
      title: "Enhanced Monitoring System",
      desc: "Deploy real-time tracking for temperature, location, and condition monitoring.",
      priority: "Low Priority",
      reduction: "15%",
    },
  ]);

  // Placeholder function for API call
  /*
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setRiskData(data.riskData);
      setTrendData(data.trendData);
      setMapData(data.mapData);
    }
    fetchData();
  }, []);
  */

const dummyResults = {
    "message": "Prediction successful",
    "total_transformation_field": [
        {
            "supplier": "68aaa37013556dfa05784c94",
            "delay_days": 6,
            "required_material": 1000,
            "predicted_material": 582,
            "loss": -41800,
            "risk_pct": 91.79,
            "recommendation": "High risk — consider backup supplier or increase safety stock",
            "_id": "68aacaea1b9eeed46a6bb245",
            "createdAt": "2025-08-24T08:18:50.121Z",
            "__v": 0
        },
        {
            "supplier": "68aaa3a813556dfa05784c96",
            "delay_days": 0,
            "geopolitical_points_bounds": 0.6,
            "required_material": 1000,
            "predicted_material": 1085,
            "loss": 9350,
            "risk_pct": 4.41,
            "recommendation": "Low risk — proceed as planned",
            "_id": "68aacaea1b9eeed46a6bb248",
            "createdAt": "2025-08-24T08:18:50.409Z",
            "__v": 0
        },
        {
            "supplier": "68aaa3c513556dfa05784c98",
            "delay_days": 0,
            "geopolitical_points_bounds": 0.3,
            "required_material": 1000,
            "predicted_material": 972,
            "loss": -3640,
            "risk_pct": 7.74,
            "recommendation": "Low risk — proceed as planned",
            "_id": "68aacaea1b9eeed46a6bb24b",
            "createdAt": "2025-08-24T08:18:50.576Z",
            "__v": 0
        }
    ]
}


  return (
    <>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
          <p className="text-gray-500">
            Real-time vulnerability monitoring and assessment
          </p>
        </div>
        <p className="text-sm text-gray-400">Last updated 2 min ago ●</p>
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
              className={`text-sm ${
                item.change > 0 ? "text-green-600" : "text-red-600"
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
        {/* Trends */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Vulnerability Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="supplier" stroke="#ef4444" />
              <Line type="monotone" dataKey="transport" stroke="#f59e0b" />
              <Line type="monotone" dataKey="geo" stroke="#3b82f6" />
              <Line type="monotone" dataKey="climate" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Map */}
        <div className="bg-white p-4 rounded-xl shadow">
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
        <div className="bg-white p-4 rounded-xl shadow">
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
        </div>

        {/* AI Strategy */}
        <div className="bg-white p-4 rounded-xl shadow">
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
          {/* <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
            Generate More Recommendations
          </button> */}
        </div>
      </div>
    </div>
    <SimulationResults results={dummyResults}></SimulationResults>
    </>
  );
}
