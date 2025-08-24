const Supplier = require('../models/Supplier');
const Prediction = require('../models/Prediction');
const axios = require('axios');

// Controller to create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        const { name, country, avg_lead_time, geopolitical_risk, price_index, reliability_score, product, priority } = req.body;
        const supplier = new Supplier({ name, country, avg_lead_time, geopolitical_risk, price_index, reliability_score, product, priority });
        await supplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error: error.message });
    }
};

//get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
}



// Prediction endpoint: frontend -> Node -> Flask -> Node saves to Mongo -> return
exports.predictSupplyRisk = async (req, res) => {    
    try {
        // const { supplierId, delay_days, geopolitical_points_bounds, transport_status, required_material } = req.body;
        const {required_material} = req.body;
        const supplier = await Supplier.findOne({ priority: 1, product: "Tyres" });

        // optional: fetch supplier (if supplierId provided)
        // let supplier = null;
        // if (supplierId) {
        //     supplier = await Supplier.findById(supplierId);
        // }

        // call Flask model server
        const flaskUrl = (process.env.FLASK_URL || "http://127.0.0.1:5000") + "/predict";
        const payload = { delay_days:supplier.delay_days,
             geopolitical_points_bounds:supplier.geopolitical_points_bounds,
              transport_status:supplier.transport_status,
               required_material };

        const flaskResp = await axios.post(flaskUrl, payload, { timeout: 8000 });
        const { predicted_material, risk_pct, recommendation, loss } = flaskResp.data;

        //mitigation
        let is_recommendation = 0;
        if (risk_pct > 70) {
            is_recommendation = 1;
        }
        console.log("Flask response:", flaskResp.data);

        // loss calculation (example logic)
        let calculatedLoss = 0;
        if (loss) {
            calculatedLoss = loss * supplier?.price_index || 1; // use supplier price index if available
        }

        // save prediction to MongoDB
        const prediction = new Prediction({
            supplier: supplier ? supplier._id : null,
            delay_days: supplier.delay_days,
            geopolitical_points_bounds: supplier.geopolitical_points_bounds,
            transport_status: supplier.transport_status,
            required_material,
            predicted_material,
            risk_pct,
            recommendation,
            loss: calculatedLoss
        });
        await prediction.save();
        let total_transformation_field =[prediction]

        if (is_recommendation) {
            for (let i = 2; i < 4; i++) {
                //find supplierr with priority 2
                const alt_supplier = await Supplier.findOne({ priority: i, product: "Tyres" });
                if (alt_supplier) {
                    // analysis data for alternative supplier
                    // const payload = { delay_days, geopolitical_points_bounds, transport_status, required_material };
                    const alt_payload = {
                        delay_days: alt_supplier.delay_days,
                        geopolitical_points_bounds: alt_supplier.geopolitical_risk,
                        transport_status: alt_supplier.transport_status,
                         required_material
                    };
                    const alt_flaskResp = await axios.post(flaskUrl, alt_payload);
                    const { predicted_material, risk_pct, recommendation, loss } = alt_flaskResp.data;
                    console.log("Alternative Flask response:", alt_flaskResp.data);
                    is_recommendation = 0;
                    if (risk_pct > 70) {
                        is_recommendation = 1;
                    }
                    // loss calculation (example logic)
                    let calculatedLoss = 0;
                    if (loss) {
                        calculatedLoss = loss * alt_supplier?.price_index || 1; // use supplier price index if available
                    }
                    // save prediction to MongoDB
                    const alt_prediction = new Prediction({
                        supplier: alt_supplier ? alt_supplier._id : null,
                        delay_days: alt_supplier.delay_days,
                        geopolitical_points_bounds: alt_supplier.geopolitical_risk,
                        transport_status:alt_supplier.transport_status,
                        required_material,
                        predicted_material,
                        risk_pct,
                        recommendation,
                        loss: calculatedLoss
                    });
                    await alt_prediction.save();
                    total_transformation_field.push(alt_prediction);
                }
            }
        }

        res.status(200).json({ message: "Prediction successful", total_transformation_field });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ message: "Error during prediction", error: error.message });
    }

};






//update suppliers
exports.updateSupplier = async (req, res) => {
    try {
        const { supplierId, ...updateData } = req.body;
        if (!supplierId) {
            return res.status(400).json({ message: "supplierId is required" });
        }

        const supplier = await Supplier.findByIdAndUpdate(
            supplierId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier updated successfully", supplier });
    } catch (e) {
        res.status(500).json({ message: "Error updating supplier", error: e.message });
    }
}
