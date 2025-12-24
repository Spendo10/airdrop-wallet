require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const chatId = process.env.TEAM_CHAT_ID;

// Send a test message
bot.sendMessage(chatId, "✅ Test message from your bot is working!")
  .then(() => console.log("Message sent!"))
  .catch(err => console.error("Error sending message:", err));
