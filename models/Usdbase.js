const mongoose = require("mongoose");

const UsdBaseSchema = new mongoose.Schema({
  base_code: { type: String, required: true },
  conversion_rates: { type: Object, required: true }, 
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UsdBase", UsdBaseSchema);