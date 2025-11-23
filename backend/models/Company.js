const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, default: "Your Company" },
  address: { type: String, default: "Lahore, Pakistan" },
  tagline: { type: String, default: "Best company" },
  logo: { type: String, default: "" }, // Store logo URL or path
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
