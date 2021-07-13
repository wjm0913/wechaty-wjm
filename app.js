const { Wechaty } = require('wechaty');
const req = require('./utils/utils')
const koaRequest = require('koa2-request')


const config = require('./config/config')
// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const name = 'wechat-puppet-wechat';
let bot = '';
bot = new Wechaty({
  name, // generate xxxx.memory-card.json and save login data for the next login
});

//  二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }
  // // 登陆后创建定时任务
  // await initDay();
}

//登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}


// 监听对话
async function onMessage(msg) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const room = msg.room(); // 是否是群消息
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text;
  if (msg.self()) {
    return;
  }

  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
    let nameText = await contact.name()

    if (topic) {
      const room = await bot.Room.find({
        topic: topic
      });
      if (nameText==='赵苗条' && content.startsWith('@')){
        console.log(content.length);
        if (content.length > 4) {
          let boxText = content.substr(5,content.length)
          if (boxText.includes('查天')) {
            room.say('查询哪里的天气的呢？格式：天气加{省份}加{城市} -- 来自赵苗条的专属机器人回复...')
            return
          }
          console.log(boxText);
          if (boxText.includes('天气')) {
            let newBoxText =  boxText.split('加')
            let url = `https://www.wjmwjh.top:8000/wx/weather/${newBoxText[1]}/${newBoxText[2]}`
            let weatherData = await koaRequest(encodeURI(url));
            let newWeatherData = JSON.parse(weatherData.body)
            if (newWeatherData.msg === 'success') {
              const { data } = newWeatherData || {}
              const { real,predict } = data || {}
              const { detail } = predict || {}
              const { publish_time, weather,wind } = real || {}
              const { temperature, feelst, info, humidity } = weather || {}
              const { direct, power} = wind || {}
              let textWeather = `实时：${publish_time}/ 天气：${info}/ 温度：${temperature}摄氏度/ 体感温度：${feelst}摄氏度/ 湿度：${humidity}/ 风向：${direct}/ 风力：${power}`
              let one = detail[1]
              let two = detail[2]
              let textWeather2 = `明天:${one.date}天气：${one.day.weather.info}/ 气温：${one.day.weather.temperature}/ 明天稍晚天气：${one.night.weather.info}/ 气温：${one.night.weather.temperature}`
              let textWeather3 = `后天:${two.date}天气：${two.day.weather.info}/ 气温：${two.day.weather.temperature}/ 后天稍晚天气：${two.night.weather.info}/ 气温：${two.night.weather.temperature}`
              console.log(textWeather,textWeather2);
              room.say(textWeather)
              room.say(textWeather2)
              room.say(textWeather3)
              return
            }
            room.say('查询失败，请检查格式？格式：天气加{省份}加{城市} -- 来自赵苗条的专属机器人回复...')
            return
          }
          room.say('其他好玩功能抓紧学习中... -- 来自赵苗条的专属机器人回复...')
        }else {
          // @ 后没有实质内容
          room.say('宝子找我干嘛呀?^^^来自赵苗条的专属机器人回复...^^^')
        }
        return
      }
      //  群内其他人 @ 我
      if (content.startsWith('@明明明')) {

        console.log(content);
        // room.say(`爱卿-${nameText}-@朕，何事，速速说来...`)
        if (content.length > 4) {
          let boxText = content.substr(5,content.length)
          if (content.includes('查天')) {
            room.say('查询哪里的天气的呢？格式：天气加省份加城市 -- 请爱卿知晓...')
            return
          }
          if (content.includes('天气')) {
            let newBoxText =  boxText.split('加')
            console.log(newBoxText);
            let url = `https://www.wjmwjh.top:8000/wx/weather/${newBoxText[1]}/${newBoxText[2]}`
            let weatherData = await koaRequest(encodeURI(url));
            let newWeatherData = JSON.parse(weatherData.body)
            if (newWeatherData.msg === 'success') {
              const { data } = newWeatherData || {}
              const { real,predict } = data || {}
              const { detail } = predict || {}
              const { publish_time, weather,wind } = real || {}
              const { temperature, feelst, info, humidity } = weather || {}
              const { direct, power} = wind || {}
              let textWeather = `实时：${publish_time}/ 天气：${info}/ 温度：${temperature}摄氏度/ 体感温度：${feelst}摄氏度/ 湿度：${humidity}/ 风向：${direct}/ 风力：${power}`
              let one = detail[1]
              let two = detail[2]
              let textWeather2 = `明天:${one.date}天气：${one.day.weather.info}/ 气温：${one.day.weather.temperature}/ 明天稍晚天气：${one.night.weather.info}/ 气温：${one.night.weather.temperature}`
              let textWeather3 = `后天:${two.date}天气：${two.day.weather.info}/ 气温：${two.day.weather.temperature}/ 后天稍晚天气：${two.night.weather.info}/ 气温：${two.night.weather.temperature}`
              console.log(textWeather,textWeather2);
              room.say(textWeather)
              room.say(textWeather2)
              room.say(textWeather3)
              return
            }
            room.say('查询失败，请检查格式？格式：天气加{省份}加{城市} -- 请爱卿知晓...')
            return
          }
          room.say('其他好玩功能朕抓紧学习中... -- 请爱卿知晓...')
        }else {
          // @ 后没有实质内容
          room.say(`爱卿${nameText}@朕何事?----请爱卿知晓...^^^`)
        }
      }
    }



  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${content}`);
    // if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
    //   let contactContent = content.replace('?', '').replace('？', '');
    //   if (contactContent) {
    //     let res = await superagent.getRubbishType(contactContent);
    //     await delay(2000);
    //     await contact.say(res);
    //   }
    // } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
    //   // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
    //   if (content) {
    //     let reply;
    //     if (config.DEFAULTBOT == '0') {
    //       // 天行聊天机器人逻辑
    //       reply = await superagent.getReply(content);
    //       console.log('天行机器人回复：', reply);
    //     } else if (config.DEFAULTBOT == '1') {
    //       // 图灵聊天机器人
    //       reply = await superagent.getTuLingReply(content);
    //       console.log('图灵机器人回复：', reply);
    //     } else if (config.DEFAULTBOT == '2') {
    //       // 天行对接的图灵聊
    //       reply = await superagent.getTXTLReply(content);
    //       console.log('天行对接的图灵机器人回复：', reply);
    //     }
    //     try {
    //       await delay(2000);
    //       await contact.say(reply);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // }
  }
}


bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));