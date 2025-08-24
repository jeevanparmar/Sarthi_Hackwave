const Supplier = require('../models/Supplier');

// Controller to create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        const { name, country, avg_lead_time,geopolitical_risk } = req.body;
        const supplier = new Supplier({ name, country, avg_lead_time,geopolitical_risk });
        await supplier.save();
        res.status(201).json({ message: 'Supplier created successfully', supplier });
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error: error.message });
    }
};