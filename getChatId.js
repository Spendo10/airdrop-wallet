// getChatId.js
const TelegramBot = require("node-telegram-bot-api");

// Replace with your bot token from BotFather
const bot = new TelegramBot("8544560502:AAEIdIgSxZyPkb2pVVR6ba8QxSpdQZSxWko", { polling: true });

// Listen to all messages the bot can see
bot.on("message", (msg) => {
  console.log("chat.id:", msg.chat.id, "title:", msg.chat.title);
});
