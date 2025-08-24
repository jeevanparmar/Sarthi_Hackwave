import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SupplyPartnersOverview() {
  const [suppliers, setSuppliers] = useState([]);
  const [bodySuppliers, setBodySuppliers] = useState([]);

  const getTyres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching tyre suppliers:", error);
    }
  };

  const getBody = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/bodyUnit");
      setBodySuppliers(response.data);
    } catch (error) {
      console.error("Error fetching body suppliers:", error);
    }
  };

  useEffect(() => {
    getTyres();
    getBody();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Supplier Details
      </h1>

      {/* Tyre Suppliers */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Tyre Suppliers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {suppliers.map((s, i) => (
            <div
              key={s._id}
              className={`p-6 rounded-2xl shadow-lg bg-white border ${
                s.priority === 1 ? "border-primary" : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {s.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Country:</span> {s.country}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Lead Time:</span> {s.avg_lead_time} days
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Reliability:</span> {s.reliability_score}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Priority:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    s.priority === 1
                      ? "bg-green-600"
                      : s.priority === 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {s.priority === 1 ? "Primary" : s.priority === 2 ? "Secondary" : "Tertiary"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Body Suppliers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Body Suppliers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bodySuppliers.map((b) => (
            <div
              key={b._id}
              className={`p-6 rounded-2xl shadow-lg bg-white border ${
                b.priority === 1 ? "border-primary" : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{b.name}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Country:</span> {b.country}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Expected Units:</span> {b.expected_units}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Defective Rate:</span> {b.defective_rate}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Priority:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    b.priority === 1
                      ? "bg-green-600"
                      : b.priority === 2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {b.priority === 1 ? "Primary" : b.priority === 2 ? "Secondary" : "Tertiary"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
