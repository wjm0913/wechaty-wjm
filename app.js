

const { Wechaty } = require('wechaty');
const { PuppetPadplus } = require("wechaty-puppet-padplus");
const config = require('./config/config')                           // 配置文件
const { MessageClass } = require('./wechatyApiClass/messageClass')  // message API 类
const {Init} = require("./wechatyApiClass/init");                   // 初始化 实体类 登录 等出 二维码


let bot = new Wechaty({
  // name: config.name,
  puppet: new PuppetPadplus({
    token: 'puppet_wxwork_8c1b37387f44dd3f'
  }),
  name: "WeChat-Robot"
});

new Init(bot).init()
new MessageClass(bot).init()
bot.start().then(() => console.log('开始登陆微信')).catch((e) => console.error(e));

