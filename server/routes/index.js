var express = require("express");
var router = express.Router();
const { Wechaty } = require("wechaty");
const { onScan } = require("../utils/wechat");

/* GET home page. */
router.get("/login", function(req, res, next) {
  const bot = new Wechaty();

  bot.on("scan", (qr, status) => {
    const qrImageUrl = onScan(qr);
    res.json({
      data: qrImageUrl
    });
  });
  // bot.on("login", onLogin);
  // bot.on("logout", onLogout);
  // bot.on("message", onMessage);

  bot
    .start()
    .then(() => console.log("Bot Started."))
    .catch(e => console.error(e));
});

module.exports = router;
