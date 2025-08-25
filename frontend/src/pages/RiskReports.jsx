// src/components/RiskReports.jsx
import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex items-center gap-3">
        <TrendingUp className="text-[#0473fb]" size={30} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Reports</h2>
          <p className="text-gray-500 text-sm">
            Showing the latest risk assessment reports
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const riskLevel =
            report.risk_pct > 70
              ? { color: "bg-red-100 text-red-700", label: "High" }
              : report.risk_pct > 40
              ? { color: "bg-yellow-100 text-yellow-700", label: "Medium" }
              : { color: "bg-green-100 text-green-700", label: "Low" };

          return (
            <Card
              key={index}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50/70">
                <CardTitle className="text-base font-semibold text-gray-800">
                  Report #{index + 1}
                </CardTitle>
                <Badge className={`${riskLevel.color} px-3 py-1 rounded-full`}>
                  {report.risk_pct}% {riskLevel.label}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {new Date(report.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p>
                  <span className="font-medium">Delay Days:</span>{" "}
                  {report.delay_days}
                </p>
                <p>
                  <span className="font-medium">Predicted Material:</span>{" "}
                  {report.predicted_material}
                </p>
                <p>
                  <span className="font-medium">Loss:</span>{" "}
                  <span
                    className={
                      report.loss < 0 ? "text-red-600" : "text-green-600"
                    }
                  >
                    {report.loss}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RiskReports;
