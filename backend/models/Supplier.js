const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true },
  country: String,
  avg_lead_time: Number,
  reliability_score: Number,
  geopolitical_risk: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Supplier", SupplierSchema);
