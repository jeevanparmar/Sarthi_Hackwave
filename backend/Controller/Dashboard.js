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

            const specificIds = [
            new mongoose.Types.ObjectId("68aaea5c6aa1ad06a689a779"),
            new mongoose.Types.ObjectId("68aaa37013556dfa05784c94")
        ];

        //---------------------calculate risk---------------------------------------------------------------------------
        // High risk suppliers for today
        const flaghighRiskSuppliers = await Prediction.countDocuments({ 
            risk_pct: { $gt: 70 },
            createdAt: { $gte: today, $lt: tomorrow }
        });
        const avgRiskPctResult = await Prediction.aggregate([
            {
            $match: {
                supplier: { $in: specificIds },
                createdAt: { $gte: today, $lt: tomorrow }
            }
            },
            {
            $group: {
                _id: null,
                avgRiskPct: { $avg: "$risk_pct" }
            }
            }
        ]);
        const avgRiskPct = avgRiskPctResult[0] ? avgRiskPctResult[0].avgRiskPct : 0;

        // High risk suppliers for previous day
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const prevDayStart = new Date(yesterday);
        const prevDayEnd = new Date(today);

        const highRiskSuppliersPrevDay = await Prediction.countDocuments({
            risk_pct: { $gt: 70 },
            createdAt: { $gte: prevDayStart, $lt: prevDayEnd }
        });
        let highRiskDiffPercent = 0;
        if (highRiskSuppliersPrevDay > 0) {
            highRiskDiffPercent = ((flaghighRiskSuppliers - highRiskSuppliersPrevDay) / highRiskSuppliersPrevDay) * 100;
        } else if (flaghighRiskSuppliers > 0) {
            highRiskDiffPercent = 100;
        }
        const supplierRisk={
            value : Math.round(avgRiskPct),
            change : Math.round(highRiskDiffPercent),
            note: `${flaghighRiskSuppliers} suppliers flagged`
        }

        //---------average delay days calculation--------------------------------------------------------------
                // Average delay days for today
        const avgDelayDays = await Prediction.aggregate([
            {
            $match: { 
                supplier: { $in: specificIds },
                createdAt: { $gte: today, $lt: tomorrow }
            }
            },
            {
            $group: { _id: null, avgDelay: { $avg: "$delay_days" } }
            }
        ]);

        // Average delay days for previous day
        const avgDelayDaysPrev = await Prediction.aggregate([
            {
            $match: { 
                supplier: { $in: specificIds },
                createdAt: { $gte: prevDayStart, $lt: prevDayEnd }
            }
            },
            {
            $group: { _id: null, avgDelay: { $avg: "$delay_days" } }
            }
        ]);

        // Calculate percentage change
        const avgDelayToday = avgDelayDays[0] ? avgDelayDays[0].avgDelay : 0;
        const avgDelayPrev = avgDelayDaysPrev[0] ? avgDelayDaysPrev[0].avgDelay : 0;
        let avgDelayDiffPercent = 0;
        if (avgDelayPrev > 0) {
            avgDelayDiffPercent = ((avgDelayToday - avgDelayPrev) / avgDelayPrev) * 100;
        } else if (avgDelayToday > 0) {
            avgDelayDiffPercent = 100;
        }
        const transportDelays={
            value : Math.round(avgDelayToday),
            change : Math.round(avgDelayDiffPercent),
            note: `Avg delay: ${avgDelayToday} days`
        }
        
//-------------------------------??//
        //predicted_material 
        // Predicted material for today
        const todayPredictedMaterialAgg = await Prediction.aggregate([
            {
            $match: {
                supplier: { $in: specificIds },
                createdAt: { $gte: today, $lt: tomorrow }
            }
            },
            {
            $group: {
                _id: null,
                totalPredictedMaterial: { $sum: "$predicted_material" }
            }
            }
        ]);
        const todayPredicted = todayPredictedMaterialAgg[0] ? todayPredictedMaterialAgg[0].totalPredictedMaterial : 0;

        // Predicted material for previous day
        const prevPredictedMaterialAgg = await Prediction.aggregate([
            {
            $match: {
                supplier: { $in: specificIds },
                createdAt: { $gte: prevDayStart, $lt: prevDayEnd }
            }
            },
            {
            $group: {
                _id: null,
                totalPredictedMaterial: { $min: "$predicted_material" }
            }
            }
        ]);
        const prevPredicted = prevPredictedMaterialAgg[0] ? prevPredictedMaterialAgg[0].totalPredictedMaterial : 0;

        // Calculate percentage change
        let predictedMaterialDiffPercent = 0;
        if (prevPredicted > 0) {
            predictedMaterialDiffPercent = ((todayPredicted - prevPredicted) / prevPredicted) * 100;
        } else if (todayPredicted > 0) {
            predictedMaterialDiffPercent = 100;
        }

        const geopolitical = {
            value: Math.round(todayPredicted),
            change: Math.round(predictedMaterialDiffPercent),
            note: `Predicted material: ${Math.round(todayPredicted)}`
        };

         //-------------predicted loss ------------------------
        // Predicted loss for today
        const todayPredictedLossAgg = await Prediction.aggregate([
            {
            $match: {
                supplier: { $in: specificIds },
                createdAt: { $gte: today, $lt: tomorrow }
            }
            },
            {
            $group: {
                _id: null,
                totalPredictedLoss: { $max: "$loss" }
            }
            }
        ]);
        const todayPredictedLoss = todayPredictedLossAgg[0] ? todayPredictedLossAgg[0].totalPredictedLoss : 0;
        // Predicted loss for previous day
        const prevPredictedLossAgg = await Prediction.aggregate([
            {
            $match: {
                supplier: { $in: specificIds },
                createdAt: { $gte: prevDayStart, $lt: prevDayEnd }
            }
            },
            {
            $group: {
                _id: null,
                totalPredictedLoss: { $max: "$loss" }
            }
            }
        ]);
        const prevPredictedLoss = prevPredictedLossAgg[0] ? prevPredictedLossAgg[0].totalPredictedLoss : 0;
        // Calculate percentage change
        let predictedLossDiffPercent = 0;
        if (prevPredictedLoss > 0) {
            predictedLossDiffPercent = ((todayPredictedLoss - prevPredictedLoss) / prevPredictedLoss) * 100;
        } else if (todayPredictedLoss > 0) {
            predictedLossDiffPercent = 100;
        }

        const climateRisk = {
            value: Math.round(todayPredictedLoss),
            change: Math.round(predictedLossDiffPercent),
            note: `Predicted loss: $${Math.round(todayPredictedLoss)}`
        };
      // =-----visualize of data of previous 7 days---------------------
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
         const trendDataAgg = await Prediction.aggregate([
                {
                $match: {
                 supplier: { $in: specificIds },
                 createdAt: { $gte: sevenDaysAgo, $lt: tomorrow }
                }
                },
                {
                $group: {
                 _id: {
                 year: { $year: "$createdAt" },
                 month: { $month: "$createdAt" },
                 day: { $dayOfMonth: "$createdAt" }
                 },
                 avgRiskPct: { $avg: "$risk_pct" },
                 avgDelayDays: { $avg: "$delay_days" },
                 totalPredictedMaterial: { $min: "$predicted_material" },
                 totalPredictedLoss: { $max: "$loss" }
                }
                },      
                {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
          ]);
        const trendData = trendDataAgg.map(item => ({
            month: `${item._id.day}/${item._id.month}`,
            supplier: Math.round(item.avgRiskPct),

            //convert into percentage of 100
            transport: Math.round(item.avgDelayDays),
            geo: Math.round(item.totalPredictedMaterial),
            climate: Math.round(item.totalPredictedLoss)
        }));


/*          const [trendData, setTrendData] = useState([
    { month: "", supplier: 50, transport: 30, geo: 40, climate: 25 },
    { month: "", supplier: 60, transport: 45, geo: 50, climate: 30 },
    { month: "", supplier: 55, transport: 35, geo: 60, climate: 40 },
    { month: "", supplier: 70, transport: 25, geo: 75, climate: 35 },
    { month: "", supplier: 65, transport: 60, geo: 55, climate: 45 },
    { month: "", supplier: 58, transport: 40, geo: 65, climate: 30 },
  ]);

*/



       return res.status(200).json({
            supplierRisk,
            transportDelays,
            geopolitical,   
            climateRisk,  
            trendData,      
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server Error" });
    }
}