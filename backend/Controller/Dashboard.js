const Supplier = require('../models/Supplier');
const Prediction = require('../models/Prediction');
const mongoose = require('mongoose');
const Bodysupplier =require("../models/Bodysupplier");

exports.getDashboardData = async (req, res) => {
    try {
        const totalTyreSuppliers = await Supplier.countDocuments();
        const totalBodySuppliers = await Bodysupplier.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const totalPredictions = await Prediction.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });
        const highRiskSuppliers = await Prediction.countDocuments({ 
            risk_pct: { $gt: 70 },
            createdAt: { $gte: today, $lt: tomorrow }
        });

        const avgDelayDays = await Supplier.aggregate([
            {
            $match: { createdAt: { $gte: today, $lt: tomorrow } }
            },
            {
            $group: { _id: null, avgDelay: { $avg: "$delay_days" } }
            }
        ]);

        res.status(200).json({
            totalTyreSuppliers,
            totalBodySuppliers,
            highRiskSuppliers,
            avgDelayDays: avgDelayDays[0] ? avgDelayDays[0].avgDelay : 0
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server Error" });
    }
}