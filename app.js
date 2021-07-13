

const { Wechaty } = require('wechaty');
const config = require('./config/config')                           // 配置文件
const { MessageClass } = require('./wechatyApiClass/messageClass')  // message API 类
const {Init} = require("./wechatyApiClass/init");                   // 初始化 实体类 登录 等出 二维码


let bot = new Wechaty({
  name: config.name, // generate xxxx.memory-card.json and save login data for the next login
});

new Init(bot).init()
new MessageClass(bot).init()
bot.start().then(() => console.log('开始登陆微信')).catch((e) => console.error(e));

