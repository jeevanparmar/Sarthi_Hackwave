// src/components/Simulation.jsx
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Simulation = () => {
    const [suppliers, setSuppliers] = useState([
        {
            _id: "68aaa37013556dfa05784c94",
            name: "Global Tyres Ltd",
            country: "Germany",
            product: "Tyres",
            priority: 1,
            avg_lead_time: 7,
            reliability_score: 0.85,
            geopolitical_risk: 0.4,
            price_index: 1000,
            delay_days: 0,
        },
        {
            _id: "68aaa3a813556dfa05784c96",
            name: "Speedy Tyres Co.",
            country: "Japan",
            product: "Tyres",
            priority: 2,
            avg_lead_time: 10,
            reliability_score: 0.78,
            geopolitical_risk: 0.6,
            price_index: 0.95,
            delay_days: 0,
        },
        {
            _id: "68aaa3c513556dfa05784c98",
            name: "Continental Rubber",
            country: "USA",
            product: "Tyres",
            priority: 3,
            avg_lead_time: 5,
            reliability_score: 0.92,
            geopolitical_risk: 0.3,
            price_index: 1.2,
            delay_days: 0,
        },
    ]);

    const [bodySuppliers, setBodySuppliers] = useState([
        {
            _id: "68aaea5c6aa1ad06a689a779",
            name: "Alpha Body Frame",
            country: "Nepal",
            product: "EV Body",
            priority: 1,
            defective_rate: 0.05,
            transport_status: 1,
            expected_units: 850,
            price_index: 1,
            delay_days: 2,
        },
        {
            _id: "68aaeadd6aa1ad06a689a77b",
            name: "Titanium Chassis",
            country: "Germany",
            product: "EV Body",
            priority: 2,
            defective_rate: 0.08,
            transport_status: 2,
            expected_units: 980,
            price_index: 1,
            delay_days: 5,
        },
        {
            _id: "68aaeb136aa1ad06a689a77d",
            name: "Carbon Street Frame",
            country: "Japan",
            product: "EV Body",
            priority: 3,
            defective_rate: 0.03,
            transport_status: 1,
            expected_units: 1120,
            price_index: 1,
            delay_days: 1,
        },
    ]);

const [tyres,setTyres]=useState(false);

    const [editsuplierbody, setEditingType] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formValues, setFormValues] = useState({});

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

    const handleSaveClick = () => {
        setBodySuppliers((prev) =>
            prev.map((s) =>
                s._id === editingSupplier ? { ...s, ...formValues } : s
            )
        );
        setEditingSupplier(null);
        setEditingType(false);

    };


    // save edited supplier
    const handleSave = () => {
        setSuppliers((prev) =>
            prev.map((s) =>
                s._id === editingSupplier ? { ...s, ...formValues } : s
            )
        );
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

    useEffect(() => {
        AOS.init({ duration: 600 });
    }, []);
    const [activeTab, setActiveTab] = useState("tyre");
    return (
        <div className="p-6" data-aos="fade-up">
            <h2 className="text-2xl font-bold mb-6">⚡ Simulation Dashboard</h2>



            {/* Tabs */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Tyre Tab */}
                <div
                    onClick={() => setActiveTab("tyre")}
                    className={`cursor-pointer rounded-2xl p-6 border transition shadow-sm hover:shadow-md ${activeTab === "tyre"
                        ? "bg-blue-600 text-white border-blue-600"
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
                        ? "bg-blue-600 text-white border-blue-400"
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

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Country</th>
                                <th className="text-left p-3">Defective Rate</th>
                                <th className="text-left p-3">Transport Status</th>
                                <th className="text-left p-3">Expected Units</th>
                                <th className="text-left p-3">Price Index</th>
                                <th className="text-left p-3">Delay Days</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bodySuppliers.map((s) => (
                                <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{s.name}</td>
                                    <td className="p-3">{s.country}</td>

                                    {/* Defective Rate with background color badge */}
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${s.defective_rate < 0.03
                                                    ? "bg-green-100 text-green-800"
                                                    : s.defective_rate <= 0.06
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {(s.defective_rate * 100).toFixed(1)}%
                                        </span>
                                    </td>

                                    <td className="p-3">{s.transport_status}</td>

                                    {/* Expected Units with background color badge */}
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${s.expected_units > 1000
                                                    ? "bg-green-100 text-green-800"
                                                    : s.expected_units >= 700
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {s.expected_units}
                                        </span>
                                    </td>

                                    <td className="p-3">{s.price_index}</td>
                                    <td className="p-3">{s.delay_days} days</td>

                                    <td className="p-3">
                                        <button
                                            onClick={() => {
                                                setEditingSupplier(s._id)
                                                setFormValues(s);
                                                setEditingType(true);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
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


            {/* Suppliers Table */}
            {activeTab === "tyre" && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold mb-2 text-lg">Suppliers for Tyres</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Adjust parameters to run "what-if" simulations.
                    </p>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Country</th>
                                <th className="text-left p-3">Avg Lead Time</th>
                                <th className="text-left p-3">Reliability</th>
                                <th className="text-left p-3">Geopolitical Risk</th>
                                <th className="text-left p-3">Price Index</th>
                                <th className="text-left p-3">Delay Days</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s) => (
                                <tr
                                    key={s._id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium">{s.name}</td>
                                    <td className="p-3">{s.country}</td>
                                    <td className="p-3">{s.avg_lead_time} days</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${s.reliability_score >= 0.9
                                                ? "bg-green-100 text-green-700"
                                                : s.reliability_score >= 0.75
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {(s.reliability_score * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="p-3">{getGeoRiskBadge(s.geopolitical_risk)}</td>
                                    <td className="p-3">{s.price_index}</td>
                                    <td className="p-3">{s.delay_days} days</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => {
                                                setEditingSupplier(s._id);
                                                setFormValues(s);
                                                setTyres(true);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
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
                                onClick={() => {setEditingSupplier(null); setTyres(false)}}
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
