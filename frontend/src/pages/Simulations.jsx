// src/components/Simulation.jsx
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Simulation = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [bodySuppliers, setBodySuppliers] = useState([]);
  const [tyres, setTyres] = useState(false);
  const [editsuplierbody, setEditingType] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [activeTab, setActiveTab] = useState("tyre");
  const navigate = useNavigate();

  console.log(formValues);
  const gettyres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/suppliers");
      console.log(response.data);
      setSuppliers(response.data);
    }
    catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  console.log("body suppliers:", bodySuppliers);

  const getBody = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/bodyUnit");
      console.log(response.data);
      setBodySuppliers(response.data);
    }
    catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === "reliability_score" ||
          name === "delay_days" ||
          name === "geopolitical_risk"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleChangeBody = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "defective_rate" || name === "expected_units" || name === "delay_days"
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const onCancel = () => {
    setEditingSupplier(null);
    setFormValues({});
    setEditingType(false);
  };

  const handleSaveClick = async () => {
    setBodySuppliers((prev) =>
      prev.map((s) =>
        s._id === editingSupplier ? { ...s, ...formValues } : s
      )
    );
    try {
      const { _id, ...updateData } = formValues;

      const res = await axios.post("http://localhost:3000/api/updateBodyUnit", {
        bodyUnitId: _id,   // rename _id → supplierId
        ...updateData      // rest of the fields
      });

      console.log("Update success:", res.data);
    } catch (err) {
      console.error("Update error:", err);
    }

    setEditingSupplier(null);
    setEditingType(false);

  };


  // save edited supplier
  const handleSave = async () => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s._id === editingSupplier ? { ...s, ...formValues } : s
      )
    );
    try {
      const { _id, ...updateData } = formValues;

      const res = await axios.post("http://localhost:3000/api/updateSupplier", {
        supplierId: _id,   // rename _id → supplierId
        ...updateData      // rest of the fields
      });

      console.log("Update success:", res.data);
    } catch (err) {
      console.error("Update error:", err);
    }

    setEditingSupplier(null);
    setTyres(false);
  };

  // ✅ Geopolitical Risk Badge
  const getGeoRiskBadge = (value) => {
    const pct = value * 100;
    if (pct <= 30)
      return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Low</span>;
    if (pct <= 60)
      return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Medium</span>;
    return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">High</span>;
  };
  const handlerTyresPrediction = async () => {
    try {
      const payload = { suppliers };
      console.log("Payload for prediction:", payload);
      const response = await axios.post("http://localhost:3000/api/predict", payload);
      console.log("Prediction response:", response.data);
      navigate("/simulateResult", { state: { data1: response.data } });
      alert("Simulation run successfully! Check console for details.");
    } catch (error) {
      console.error("Error running simulation:", error);
      alert("Failed to run simulation. Check console for details.");
    }
  };

  const handlerBodyPrediction = async () => {
    alert("click")
    try {
      console.log("Running body prediction...");
      const payload = { bodySuppliers };
      const response = await axios.post("http://localhost:3000/api/predictBodyUnit",payload);
      console.log("Prediction response:", response.data);
      navigate("/simulateResult", { state: { data1: response.data } });
      alert("Simulation run successfully! Check console for details.");
    }
    catch (error) {
      console.error("Error running simulation:", error);
      alert("Failed to run simulation. Check console for details.");
    }
  }

  useEffect(() => {
    AOS.init({ duration: 600 });
    gettyres();
    getBody();
  }, []);
  return (
    <div className="p-6" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-6">⚡ Simulation Dashboard</h2>



      {/* Tabs */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {/* Tyre Tab */}
        <div
          onClick={() => setActiveTab("tyre")}
          className={`cursor-pointer rounded-2xl p-6 border transition shadow-sm hover:shadow-md ${activeTab === "tyre"
            ? "bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
        >
          <h3 className="text-xl font-semibold mb-2">Tyre</h3>
          <p className={`text-sm ${activeTab === "tyre" ? "text-blue-100" : "text-gray-500"}`}>
            Suppliers and risk data for tyre manufacturing. Includes lead time,
            reliability, and cost details.
          </p>
        </div>

        {/* Body Tab */}
        <div
          onClick={() => setActiveTab("body")}
          className={`cursor-pointer rounded-2xl p-6 border transition shadow-sm hover:shadow-md ${activeTab === "body"
            ? "bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white border-blue-400"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
        >
          <h3 className="text-xl font-semibold mb-2">Body</h3>
          <p className={`text-sm ${activeTab === "body" ? "text-blue-100" : "text-gray-500"}`}>
            Details of suppliers providing vehicle body components,
            with production timelines and risks.
          </p>
        </div>
      </div>

      {activeTab === "body" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold mb-2 text-lg">Suppliers for Body</h3>
          <p className="text-sm text-gray-500 mb-6">
            Adjust parameters to run "what-if" simulations.
          </p>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-left text-sm font-medium">
                  <th className="p-4">Name</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Defective Rate</th>
                  <th className="p-4">Transport Status</th>
                  <th className="p-4">Expected Units</th>
                  <th className="p-4">Price Index</th>
                  <th className="p-4">Delay Days</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bodySuppliers.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium text-gray-800">{s.name}</td>
                    <td className="p-4 text-gray-600">{s.country}</td>

                    {/* Defective Rate badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${s.defective_rate < 0.03
                            ? "bg-green-100 text-green-700"
                            : s.defective_rate <= 0.06
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {(s.defective_rate * 100).toFixed(1)}%
                      </span>
                    </td>

                    {/* Transport Status */}
                    <td className="p-4 text-gray-600">{s.transport_status}</td>

                    {/* Expected Units badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${s.expected_units > 1000
                            ? "bg-green-100 text-green-700"
                            : s.expected_units >= 700
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {s.expected_units}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">{s.price_index}</td>
                    <td className="p-4 text-gray-600">{s.delay_days} days</td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingSupplier(s._id);
                          setFormValues(s);
                          setEditingType(true);
                        }}
                        className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Run Simulation Button */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
              onClick={handlerBodyPrediction}
            >
              Run Simulation
            </button>
          </div>
        </div>
      )}

      {editsuplierbody && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              ✏️ Edit Body Supplier
            </h3>

            <div className="space-y-4">
              {/* Defective Rate */}
              <div>
                <label className="text-sm font-medium text-gray-700">Defective Rate</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  name="defective_rate"
                  value={formValues.defective_rate}
                  onChange={handleChangeBody}
                  className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Expected Units */}
              <div>
                <label className="text-sm font-medium text-gray-700">Expected Units</label>
                <input
                  type="number"
                  name="expected_units"
                  value={formValues.expected_units}
                  onChange={handleChangeBody}
                  className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Delay Days */}
              <div>
                <label className="text-sm font-medium text-gray-700">Delay Days</label>
                <input
                  type="number"
                  name="delay_days"
                  value={formValues.delay_days}
                  onChange={handleChangeBody}
                  className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      {activeTab === "tyre" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold mb-2 text-lg">Suppliers for Tyres</h3>
          <p className="text-sm text-gray-500 mb-6">
            Adjust parameters to run "what-if" simulations.
          </p>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-left text-sm font-medium">
                  <th className="p-4">Name</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Avg Lead Time</th>
                  <th className="p-4">Reliability</th>
                  <th className="p-4">Geopolitical Risk</th>
                  <th className="p-4">Price Index</th>
                  <th className="p-4">Delay Days</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium text-gray-800">{s.name}</td>
                    <td className="p-4 text-gray-600">{s.country}</td>
                    <td className="p-4 text-gray-600">{s.avg_lead_time} days</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${s.reliability_score >= 0.9
                            ? "bg-green-100 text-green-700"
                            : s.reliability_score >= 0.75
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {(s.reliability_score * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-4">{getGeoRiskBadge(s.geopolitical_risk)}</td>
                    <td className="p-4 text-gray-600">{s.price_index}</td>
                    <td className="p-4 text-gray-600">{s.delay_days} days</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingSupplier(s._id);
                          setFormValues(s);
                          setTyres(true);
                        }}
                        className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Run Simulation Button */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
              onClick={handlerTyresPrediction}
            >
              Run Simulation
            </button>
          </div>
        </div>
      )}

      {tyres && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl transform transition-all scale-95 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              ✏️ Edit Supplier
            </h3>

            <div className="space-y-4">
              {/* Reliability Score */}
              <input
                type="number"
                step="0.01"
                name="reliability_score"
                value={formValues.reliability_score}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />


              <select
                name="geopolitical_risk"
                value={formValues.geopolitical_risk}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.7}>High</option>
                <option value={0.5}>Medium</option>
                <option value={0.3}>Low</option>
              </select>


              {/* Delay Days */}
              <div>
                <label className="text-sm text-gray-600">Delay Days</label>
                <input
                  type="number"
                  name="delay_days"
                  value={formValues.delay_days}   // <-- controlled input
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                onClick={() => { setEditingSupplier(null); setTyres(false) }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Simulation;
