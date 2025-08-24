const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BodySupplierSchema = new Schema({
  name: { type: String, required: true },
  country: String,
  product : String,
  priority: { type: Number},
  reliability_score: Number,
  defective_rate: { type: Number },
  geopolitical_risk: Number,
  transport_status: { type: Number },
  expected_units: { type: Number },
  price_index: Number,
  delay_days : { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bodyparts", BodySupplierSchema);
