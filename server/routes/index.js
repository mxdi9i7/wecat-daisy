var express = require("express");
var router = express.Router();
const { Wechaty, Room } = require("wechaty");
const { onScan } = require("../utils/wechat");
const bot = new Wechaty();

let qrImageUrl;

bot.on("scan", (qr, status) => {
  qrImageUrl = onScan(qr);
});
// bot.on("login", onLogin);
// bot.on("logout", onLogout);
// bot.on("message", onMessage);

bot
  .start()
  .then(() => console.log("Bot Started."))
  .catch(e => console.error(e));

/* GET home page. */
router.get("/login", function(req, res, next) {
  res.json({
    data: qrImageUrl
  });
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

module.exports = router;
