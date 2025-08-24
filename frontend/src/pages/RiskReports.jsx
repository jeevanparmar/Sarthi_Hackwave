// src/components/RiskReports.jsx
import React, { useState } from "react";
import { Calendar, Download, FileText } from "lucide-react";

const RiskReports = () => {
  const [reports] = useState([
    {
      id: 1,
      title: "Q4 2024 Supply Chain Risk Assessment",
      date: "2024-12-15",
      type: "Quarterly",
      status: "Complete",
    },
    {
      id: 2,
      title: "Port Disruption Impact Analysis",
      date: "2024-12-10",
      type: "Special",
      status: "Complete",
    },
    {
      id: 3,
      title: "Monthly Risk Summary - December",
      date: "2024-12-01",
      type: "Monthly",
      status: "Draft",
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Risk Reports</h2>
          <p className="text-gray-500 text-sm">
            Access and generate comprehensive risk assessment reports
          </p>
        </div>
        <button className="px-4 py-2 text-white rounded-lg shadow bg-gradient-to-r from-[#0473fb] to-[#042c70] flex items-center gap-2">
          <FileText size={18} />
          Generate New Report
        </button>
      </div>

      {/* Reports Section */}
      <div className="bg-white shadow-sm rounded-xl p-4">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Available Reports
        </h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex justify-between items-center p-4 rounded-lg border border-gray-200 hover:shadow-sm transition bg-white"
            >
              {/* Left side */}
              <div>
                <h4 className="font-medium text-gray-800">
                  {report.title}
                </h4>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Calendar size={16} />
                    {report.date}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                    {report.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      report.status === "Complete"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Right side */}
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  report.status === "Complete"
                    ? "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={report.status !== "Complete"}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskReports;
