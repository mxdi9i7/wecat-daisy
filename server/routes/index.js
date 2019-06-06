var express = require("express");
var router = express.Router();
const { Wechaty, Room } = require("wechaty");
const { onScan } = require("../utils/wechat");
const WECHATY_PUPPET_PADCHAT_TOKEN = "puppet_padchat_6916fdbccc66d07f";
const puppet = "wechaty-puppet-padchat"; // 使用ipad 的方式接入。
const puppetOptions = {
  token: WECHATY_PUPPET_PADCHAT_TOKEN
};
const bot = new Wechaty({
  puppet,
  puppetOptions
});

let qrImageUrl;
let isLoggedIn;

bot.on("scan", (qr, status) => {
  qrImageUrl = onScan(qr);
});
bot.on("login", () => {
  isLoggedIn = true;
});

// bot.on("ready", async () => {
//   const allRooms = await bot.Room.findAll();
//   console.log(allRooms);
// });
// bot.on("logout", onLogout);
// bot.on("message", onMessage);

bot
  .start()
  .then(() => console.log("Bot Started."))
  .catch(e => console.error(e));

router.get("/qr", (req, res) => {
  res.json({
    data: qrImageUrl
  });
});

router.get("/login", function(req, res, next) {
  if (isLoggedIn) {
    res.json({
      data: isLoggedIn
    });
  } else {
    res.json({
      data: false
    });
  }
});

router.get("/rooms", async (req, res) => {
  await bot.Room.sync();
  const roomList = await bot.Room.findAll();
  const roomListNames = [];
  for (let i = 0; i < roomList.length; i++) {
    const element = await roomList[i].topic();
    roomListNames.push(element);
  }

  res.json({
    data: roomListNames
  });
});

router.get("/rooms/send", async (req, res) => {
  const { msg, timeout } = req.query;
  if (msg && timeout) {
    const roomList = await bot.Room.findAll();
    var i = 0;
    function myLoop() {
      setTimeout(async function() {
        if (i < roomList.length) {
          const roomName = await roomList[i].topic();
          console.log(roomName);
          await roomList[i].say(msg);

          i++;
          myLoop();
        } else {
          res.json({
            data: true
          });
        }
      }, timeout * 1000);
    }

    myLoop();
  } else {
    res.json({
      data: false
    });
  }
});

module.exports = router;
