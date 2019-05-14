var express = require("express");
var router = express.Router();
const { Wechaty, Room } = require("wechaty");
const { onScan } = require("../utils/wechat");
const bot = new Wechaty();

let qrImageUrl;
let isLoggedIn;

bot.on("scan", (qr, status) => {
  qrImageUrl = onScan(qr);
});
bot.on("login", () => {
  isLoggedIn = true;
});
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
      data: qrImageUrl
    });
  }
});

router.get("/rooms", async (req, res) => {
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
