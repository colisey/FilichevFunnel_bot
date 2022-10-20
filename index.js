const TelegramApi = require("node-telegram-bot-api");
const token = "5760738946:AAGNz2M5GLqF3eX8r41HCUMs-wHmgyjafVA";

const {gameOptions} = require('./options')

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Начальное приветствие" },
    { command: "/game", description: "Поитграем в игру?" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    // console.log(msg);

    switch (text) {
      case "/start":
        await bot.sendSticker(
          chatId,
          `https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/7.webp`
        );
        await bot.sendMessage(chatId, `Приветствую тебя в моём тестовом боте`);
        break;

      case "/info":
        await bot.sendMessage(
          chatId,
          `Немного о тебе ${msg.chat.first_name} ${msg.chat.last_name}`
        );
        break;
      case "/game":
        await bot.sendSticker(
          chatId,
          `https://tlgrm.ru/_/stickers/c8f/100/c8f1006e-f329-430f-af5c-d2fb68819d44/1.webp`
        );
        await bot.sendMessage(chatId, `Поиграем в игру?`);
        const randomNumber = Math.floor(Math.random() * 10);

        chats[chatId] = randomNumber;
        await bot.sendMessage(chatId, `Отгадывай`, gameOptions);

        break;

      default:
        await bot.sendMessage(chatId, `Ты написал мне ${text}`);
        break;
    }
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  // console.log('chats',chats[chatId]);
  // console.log('data',data);

  if (data == chats[chatId]) {
    return await bot.sendMessage(chatId, `Ты угадал цыфра была ${chats[chatId]}`);
  }
  return await bot.sendMessage(chatId, `Ты НЕ угадал цыфра была ${chats[chatId]}`);

  bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
  // console.log(msg);
});

start();
