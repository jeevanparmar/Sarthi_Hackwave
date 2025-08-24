const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: false },
  delay_days: Number,
  geopolitical_points_bounds: Number,
  transport_status: Number,
  required_material: Number,
  predicted_material: Number,
  loss: Number,
  risk_pct: Number,
  recommendation: String,
  companyName: { type: String, default: "xyz private ltd" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
