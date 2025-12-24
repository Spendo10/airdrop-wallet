// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const Wallet = require("../models/Wallet"); // Import Wallet model

const app = express();
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Debug env loading
console.log("BOT_TOKEN loaded:", !!process.env.BOT_TOKEN);
console.log("GROUP_CHAT_ID:", process.env.GROUP_CHAT_ID);
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

// Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Log any message the bot receives
bot.on("message", (msg) => {
  console.log("Message received from Telegram:", msg.text);
});

// Send test message on startup
if (process.env.GROUP_CHAT_ID) {
  bot.sendMessage(
    process.env.GROUP_CHAT_ID,
    "✅ Bot is LIVE and connected successfully!"
  ).catch(err => console.error("Telegram send error:", err.message));
}

// API endpoint to save wallet addresses
app.post("/api/wallet-connect", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: "Address missing" });

    const exists = await Wallet.findOne({ address });
    if (!exists) {
      await Wallet.create({ address });
      // Notify Telegram
      if (process.env.GROUP_CHAT_ID) {
        await bot.sendMessage(
          process.env.GROUP_CHAT_ID,
          `🟢 New Wallet Connected: ${address}`
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server on LAN
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} and accessible on LAN`);
});
