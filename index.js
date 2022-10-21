const TelegramApi = require("node-telegram-bot-api");
const token = "5760738946:AAGNz2M5GLqF3eX8r41HCUMs-wHmgyjafVA";
const sequelize = require("./db");
const UserModel = require("./models");

const { gameOptions } = require("./options");

const bot = new TelegramApi(token, { polling: true });

const chats = {};
const webAppUrl = "https://aesthetic-granita-6e61e0.netlify.app/";

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log("Подключение к бд сломалось = ", error);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Начальное приветствие" },
    { command: "/game", description: "Поитграем в игру?" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const UserId = msg.from.id;
    const img = await bot.getUserProfilePhotos(UserId);

    try {
      switch (text) {
        case "/start":
          // console.log("img", JSON.stringify(img.photos[0][0]) );
          // console.log("UserId", UserId);

          

          await bot.sendMessage(
            chatId,
            `Ниже появится кнопка, заполни форму 👇👇👇`
          );
          await bot.sendSticker(
            chatId,
            `https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/7.webp`
          );
          // await bot.sendSticker(
          //   chatId,
          //   img
          // );
          await bot.sendMessage(
            chatId,
            `Ниже появится кнопка, заполни форму 👇👇👇`,
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "inline_keyboard", web_app: { url: webAppUrl+'form' } }],
                ],
                // keyboard: [
                //   [
                //     { text: "Заполнить форму" },
                //     { text: "Заполнить форму" },
                //     { text: "Заполнить форму" },
                //   ]
                // ],
              },
            }
          );
          await UserModel.create({ chatId });
          break;

        case "/info":
          const user = await UserModel.findOne({ chatId });
          await bot.sendMessage(
            chatId,
            `Немного о тебе ${msg.chat.first_name} ${msg.chat.last_name}, в итоге у тебя ответов правильных ${user.right} и ${user.wrong} неправильных`
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
    } catch (e) {
      // console.log("e", e);
      return bot.sendMessage(chatId, `Произошла какая то ошибка! 11 ${e}`);
    }

    // console.log(msg);
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  // console.log('chats',chats[chatId]);
  // console.log('data',data);

  const user = await UserModel.findOne({ chatId });

  if (data == chats[chatId]) {
    user.right += 1;
    await bot.sendMessage(chatId, `Ты угадал цыфра была ${chats[chatId]}`);
  } else {
    user.wrong += 1;
    await bot.sendMessage(chatId, `Ты НЕ угадал цыфра была ${chats[chatId]}`);
  }
  await user.save();

  // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
  // console.log(msg);
});

start();
