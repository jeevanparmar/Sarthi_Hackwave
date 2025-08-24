// src/components/SimulationResults.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const SimulationResults = () => {
  // Dummy backend-like data
  const data = {
    message: "Prediction successful",
    total_transformation_field: [
      {
        supplier: "68aaa37013556dfa05784c94",
        delay_days: 6,
        required_material: 1000,
        predicted_material: 582,
        loss: -41800,
        risk_pct: 91.79,
        recommendation:
          "High risk — consider backup supplier or increase safety stock",
        _id: "68aacaea1b9eeed46a6bb245",
      },
      {
        supplier: "68aaa3a813556dfa05784c96",
        delay_days: 0,
        geopolitical_points_bounds: 0.6,
        required_material: 1000,
        predicted_material: 1085,
        loss: 9350,
        risk_pct: 4.41,
        recommendation: "Low risk — proceed as planned",
        _id: "68aacaea1b9eeed46a6bb248",
      },
      {
        supplier: "68aaa3c513556dfa05784c98",
        delay_days: 0,
        geopolitical_points_bounds: 0.3,
        required_material: 1000,
        predicted_material: 972,
        loss: -3640,
        risk_pct: 7.74,
        recommendation: "Low risk — proceed as planned",
        _id: "68aacaea1b9eeed46a6bb24b",
      },
    ],
  };

  const suppliers = data.total_transformation_field;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Simulation Results
      </h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart: Required vs Predicted */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-2">
            Required vs Predicted Material
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={suppliers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="required_material"
                fill="#042c70"
                name="Required"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="predicted_material"
                fill="#0473fb"
                name="Predicted"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Risk % over suppliers */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-2">Risk % by Supplier</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={suppliers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="risk_pct"
                stroke="#0473fb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loss Chart */}
        <div className="bg-white shadow-md rounded-2xl p-4 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">
            Financial Loss / Profit by Supplier
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={suppliers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="loss"
                name="Loss / Profit"
                radius={[6, 6, 0, 0]}
                fill="#0473fb"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Risk Table */}
<div className="bg-white shadow-md rounded-2xl p-4">
  <h3 className="text-lg font-semibold mb-4">Supplier Risk Assessment</h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-left">
          <th className="p-3 font-semibold">Supplier</th>
          <th className="p-3 font-semibold">Delay</th>
          <th className="p-3 font-semibold">Required</th>
          <th className="p-3 font-semibold">Predicted</th>
          <th className="p-3 font-semibold">Loss</th>
          <th className="p-3 font-semibold">Risk %</th>
          <th className="p-3 font-semibold">Recommendation</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {suppliers.map((s) => (
          <tr
            key={s._id}
            className="hover:bg-gray-50 transition rounded-xl"
          >
            {/* Supplier ID with pill */}
            <td className="p-3 font-medium">
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                {s.supplier.slice(0, 6)}...
              </span>
            </td>

            {/* Delay days */}
            <td className="p-3 text-gray-700">{s.delay_days}</td>

            {/* Required */}
            <td className="p-3">{s.required_material}</td>

            {/* Predicted */}
            <td className="p-3">{s.predicted_material}</td>

            {/* Loss with color */}
            <td
              className={`p-3 font-semibold ${
                s.loss > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {s.loss}
            </td>

            {/* Risk with badge */}
            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  s.risk_pct > 70
                    ? "bg-red-100 text-red-700"
                    : s.risk_pct > 30
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {s.risk_pct.toFixed(2)}%
              </span>
            </td>

            {/* Recommendation with italic style */}
            <td className="p-3 text-gray-600 italic">{s.recommendation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default SimulationResults;
