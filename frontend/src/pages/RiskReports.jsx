// src/components/RiskReports.jsx
import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import axios from "axios";

const RiskReports = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getReports");
      console.log("report data", res.data);

      // latest reports first
      const sorted = (res.data.reports || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setReports(sorted);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="text-[#0473fb]" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Risk Reports</h2>
          <p className="text-gray-500 text-sm">
            Showing the latest risk assessment reports
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Top Risk Highlight */}
            <div
              className={`p-4 flex justify-between items-center ${
                report.risk_pct > 70
                  ? "bg-red-50"
                  : report.risk_pct > 40
                  ? "bg-yellow-50"
                  : "bg-green-50"
              }`}
            >
              <h4 className="font-semibold text-gray-800">
                Report #{index + 1}
              </h4>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  report.risk_pct > 70
                    ? "bg-red-100 text-red-700"
                    : report.risk_pct > 40
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {report.risk_pct}% Risk
              </span>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span>{report.date}</span>
              </div>
              <p>
                <span className="font-medium text-gray-800">Delay Days:</span>{" "}
                {report.delay_days}
              </p>
              <p>
                <span className="font-medium text-gray-800">
                  Predicted Material:
                </span>{" "}
                {report.predicted_material}
              </p>
              <p>
                <span className="font-medium text-gray-800">Loss:</span>{" "}
                <span className="text-red-600">{report.loss}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskReports;
