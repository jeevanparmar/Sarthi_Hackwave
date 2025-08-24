const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true },
  country: String,
  product : String,
  priority: { type: Number},
  avg_lead_time: Number,
  reliability_score: Number,
  geopolitical_risk: Number,
  price_index: Number,
  delay_days : { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Supplier", SupplierSchema);
