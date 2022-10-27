const token =
  process.env.TELEGRAM_TOKEN ||
  "5760738946:AAGNz2M5GLqF3eX8r41HCUMs-wHmgyjafVA";
const TelegramApi = require("node-telegram-bot-api");
const bot = new TelegramApi(token, { polling: true });
const sequelize = require("./db");
const UserModel = require("./models");

const chats = {};
const webAppUrl = "https://aesthetic-granita-6e61e0.netlify.app/";

// const { gameOptions } = require("./options");

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log("Подключение к бд сломалось = ", error);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/form", description: "Пример Формы сбора данных" },
    { command: "/shop", description: "Пример магазина" },
    { command: "/basket", description: "Пример корзины магазина" },
    { command: "/gallery", description: "Пример галлереи" },
    { command: "/cases", description: "Пример Кейсов" },
    { command: "/contacts", description: "Контакты" },
    // { command: "/info", description: "Начальное приветствие" },
    // { command: "/game", description: "Поитграем в игру?" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const UserId = msg.from.id;
    const images = await bot.getUserProfilePhotos(UserId);
    const imgSrc = images.photos[0][0].file_id;
    // const img = <img src=`${imgSrc}` /> ;

    try {
      switch (text) {
        case "/start":
          const url = "https://blog.altuninvv.ru/apple-touch-icon.png";
          const caption = "Это подпись к нашей картинке!";

          // const link = url+'/n'+caption;

          const opts = {
            reply_to_message_id: msg.message_id,
            reply_markup: {
              keyboard: [
                
                [
                  {
                    text: "🛒 Перейти в магазин",
                    web_app: { url: webAppUrl + "shop" },
                  },
                  {
                    text: "🛒 Перейти в Корзину",
                    web_app: { url: webAppUrl + "basket" },
                  },
                  {
                    text: "🪪 Заполнить форму",
                    web_app: { url: webAppUrl + "form" },
                  },
                ],
                [
                  {
                    text: "🛒 Перейти в Галлерею",
                    web_app: { url: webAppUrl+'gallery' },
                  },
                  {
                    text: "🛒 Псмотреть кейсы",
                    web_app: { url: webAppUrl + "cases" },
                  },
                  {
                    text: "Мои контакты",
                    web_app: { url: webAppUrl + "contacts" },
                  },
                ],
              ],
              resize_keyboard: true,
            },
            parse_mode: "HTML",
            // photo: [imgSrc, 30, 30]
          };
          await bot.sendMessage(chatId, caption, opts);
          // await bot.sendSticker(
          //   chatId,
          //   `https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/7.webp`
          // );
          if (imgSrc) {
            await bot.sendPhoto(chatId, imgSrc, {
              caption: "Lovely kittens 001",
              parse_mode: "HTML",
            });
          }
          // bot.sendPhoto(chat_id,path_to_photo,{width:32px, height:32px})
          // console.log('images',images.photos[0][0].file_id);

          // await UserModel.create({ chatId });
          break;
        case "/form":
          await bot.sendMessage(
            chatId,
            `Ниже появится кнопка, заполни форму регистрации 👇👇👇`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Заполнить форму",
                      web_app: { url: webAppUrl + "form" },
                    },
                  ],
                ],
              },
            }
          );

          break;

        case "/shop":
          await bot.sendMessage(chatId, `Переходи в магазин`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "В магазин",
                    web_app: { url: webAppUrl },
                  },
                ],
              ],
            },
          });
          break;
        case "/basket":
          await bot.sendMessage(chatId, `Переходи в магазин`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "В магазин",
                    web_app: { url: webAppUrl + "basket" },
                  },
                ],
              ],
            },
          });
          break;
        case "/gallery":
          await bot.sendMessage(chatId, `Переходи в магазин`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "В магазин",
                    web_app: { url: webAppUrl + "gallery" },
                  },
                ],
              ],
            },
          });
          break;
        case "/cases":
          await bot.sendMessage(chatId, `Переходи в магазин`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "В магазин",
                    web_app: { url: webAppUrl + "cases" },
                  },
                ],
              ],
            },
          });
          break;
        case "/contacts":
          await bot.sendMessage(chatId, `Переходи в магазин`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "В магазин",
                    web_app: { url: webAppUrl + "contacts" },
                  },
                ],
              ],
            },
          });
          break;

        // case "/info":
        //   // const user = await UserModel.findOne({ chatId });
        //   await bot.sendMessage(
        //     chatId,
        //     `Немного о тебе ${msg.chat.first_name} ${msg.chat.last_name}, в итоге у тебя ответов правильных ${user.right} и ${user.wrong} неправильных`
        //   );
        //   break;
        // case "/game":
        //   await bot.sendSticker(
        //     chatId,
        //     `https://tlgrm.ru/_/stickers/c8f/100/c8f1006e-f329-430f-af5c-d2fb68819d44/1.webp`
        //   );
        //   await bot.sendMessage(chatId, `Поиграем в игру?`);
        //   const randomNumber = Math.floor(Math.random() * 10);

        //   chats[chatId] = randomNumber;
        //   await bot.sendMessage(chatId, `Отгадывай`, gameOptions);

        //   break;

        default:
          await bot.sendMessage(chatId, `Ты написал мне ${text}`);
          break;
      }

      if (msg?.web_app_data?.data) {
        const data = JSON.parse(msg?.web_app_data?.data);

        await bot.sendMessage(chatId, `Спасибо за обратную связь`);
        await bot.sendMessage(chatId, `Ваша страна ${data.country}`);
        await bot.sendMessage(chatId, `Ваша street ${data.street}`);

        setTimeout(async () => {
          await bot.sendMessage(chatId, `Мы следим за вами :)`);
        }, 3000);
      }
    } catch (e) {
      return bot.sendMessage(chatId, `Произошла какая то ошибка! 11 ${e}`);
    }
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

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
