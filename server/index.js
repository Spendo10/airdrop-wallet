require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const Wallet = require("../models/Wallet"); // import Wallet model

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // serve frontend

// Debug env
console.log("BOT_TOKEN loaded:", !!process.env.BOT_TOKEN);
console.log("GROUP_CHAT_ID:", process.env.GROUP_CHAT_ID);
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  console.log("Message from Telegram:", msg.text);
});

bot.sendMessage(
  process.env.GROUP_CHAT_ID,
  "✅ Bot is LIVE and connected successfully!"
).catch(err => console.error("Telegram send error:", err.message));

// API endpoint to save wallet address
app.post("/api/wallet-connect", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: "No wallet address" });

    const exists = await Wallet.findOne({ address });
    if (!exists) {
      await Wallet.create({ address });
      await bot.sendMessage(
        process.env.GROUP_CHAT_ID,
        `🟢 New Wallet Connected: ${address}`
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
