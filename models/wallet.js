const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  address: { type: String, required: true },
  signature: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Wallet", walletSchema);
