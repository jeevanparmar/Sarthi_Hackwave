// src/components/SimulationResults.jsx
import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

export default function SimulationResults({ results }) {
  if (!results || !results.total_transformation_field) {
    return <p className="text-gray-500">No simulation results available</p>;
  }

  // ✅ Transform data for RadarChart (clean labels)
  const chartData = results.total_transformation_field.map((item, index) => ({
    supplier: `Supplier ${index + 1}`, // human-readable label
    risk: item.risk_pct,
    loss: item.loss,
  }));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 Simulation Results</h2>

      {/* Table View */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Supplier ID</th>
              <th className="border px-4 py-2">Delay (days)</th>
              <th className="border px-4 py-2">Required</th>
              <th className="border px-4 py-2">Predicted</th>
              <th className="border px-4 py-2">Loss</th>
              <th className="border px-4 py-2">Risk %</th>
              <th className="border px-4 py-2">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {results.total_transformation_field.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-gray-50">
                {/* ✅ Use real supplier ID here */}
                <td className="border px-4 py-2">{item.supplier}</td>
                <td className="border px-4 py-2">{item.delay_days ?? "-"}</td>
                <td className="border px-4 py-2">{item.required_material}</td>
                <td className="border px-4 py-2">{item.predicted_material}</td>
                <td className="border px-4 py-2">{item.loss}</td>
                <td className="border px-4 py-2">{item.risk_pct.toFixed(2)}%</td>
                <td className="border px-4 py-2">{item.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center">
        <RadarChart
          outerRadius={120}
          width={500}
          height={400}
          data={chartData}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="supplier" />
          <PolarRadiusAxis />
          <Radar
            name="Risk %"
            dataKey="risk"
            stroke="#FF5733"
            fill="#FF5733"
            fillOpacity={0.6}
          />
          <Radar
            name="Loss"
            dataKey="loss"
            stroke="#3366FF"
            fill="#3366FF"
            fillOpacity={0.4}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </div>
    </div>
  );
}
