require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const Wallet = require("../models/Wallet");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Telegram bot
if (!process.env.BOT_TOKEN) {
  console.warn("❌ Telegram Bot Token not provided!");
}
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  console.log("Message from Telegram:", msg.text);
});

// API endpoint to save wallet info
app.post("/api/wallet-connect", async (req, res) => {
  const { address, signature } = req.body;
  try {
    const wallet = new Wallet({ address, signature });
    await wallet.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// Serve front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
