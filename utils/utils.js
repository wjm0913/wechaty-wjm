const superagent = require('superagent')

/**
 *
 * @param url 请求地址
 * @param method 请求方法
 * @param params 请求参数
 * @param data 请求body
 * @param cookies cookies
 * @param spider 是否需要爬取数据
 * @param platform 请求哪个平台 tx 天行数据  tl 图灵机器人
 * @returns {Promise}
 */
function req({url, method, params, data, cookies, spider = false, platform = 'tx'}) {
    return new Promise(function (resolve, reject) {
        superagent(method, url)
            .query(params)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end(function (err, response) {
                if (err) {
                    console.log('请求出错', err)
                    reject(err)
                }
                if (spider) { // 如果是爬取内容，直接返回页面html
                    resolve(response.text)
                } else { // 如果是非爬虫，返回格式化后的内容
                    const res = JSON.parse(response.text);
                    console.log(res);
                    return
                    if (res.code !== 200 && platform === 'tx' || res.code !== 100000 && platform === 'tl') {
                        console.error('接口请求失败', res.msg || res.text)
                    }
                    resolve(res)
                }
            })
    })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 第三方 避免和 自己 写的 api 冲突
 * @param text
 * @returns {boolean}
 */
function excludeType(text) {
    if (text.includes('天气')) {
        return true
    } else {
        return false
    }
}

module.exports = {
    req,
    delay,
    excludeType
}


// 监听对话
// async function onMessage(msg) {
//   const contact = msg.talker(); // 发消息人
//   const content = msg.text().trim(); // 消息内容
//   const room = msg.room(); // 是否是群消息
//   const alias = await contact.alias() || await contact.name(); // 发消息人备注
//   const isText = msg.type() === bot.Message.Type.Text;
//   if (msg.self()) {
//     return;
//   }
//
//   if (room && isText) {
//     // 如果是群消息 目前只处理文字消息
//     const topic = await room.topic();
//     console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
//     let nameText = await contact.name()
//
//     if (topic) {
//       const room = await bot.Room.find({
//         topic: topic
//       });
//       if (nameText==='赵苗条' && content.startsWith('@')){
//         console.log(content.length);
//         if (content.length > 4) {
//           let boxText = content.substr(5,content.length)
//           if (boxText.includes('查天')) {
//             room.say('查询哪里的天气的呢？格式：天气加{省份}加{城市} -- 来自赵苗条的专属机器人回复...')
//             return
//           }
//           console.log(boxText);
//           if (boxText.includes('天气')) {
//             let newBoxText =  boxText.split('加')
//             let url = `https://www.wjmwjh.top:8000/wx/weather/${newBoxText[1]}/${newBoxText[2]}`
//             let weatherData = await koaRequest(encodeURI(url));
//             let newWeatherData = JSON.parse(weatherData.body)
//             if (newWeatherData.msg === 'success') {
//               const { data } = newWeatherData || {}
//               const { real,predict } = data || {}
//               const { detail } = predict || {}
//               const { publish_time, weather,wind } = real || {}
//               const { temperature, feelst, info, humidity } = weather || {}
//               const { direct, power} = wind || {}
//               let textWeather = `实时：${publish_time}/ 天气：${info}/ 温度：${temperature}摄氏度/ 体感温度：${feelst}摄氏度/ 湿度：${humidity}/ 风向：${direct}/ 风力：${power}`
//               let one = detail[1]
//               let two = detail[2]
//               let textWeather2 = `明天:${one.date}天气：${one.day.weather.info}/ 气温：${one.day.weather.temperature}/ 明天稍晚天气：${one.night.weather.info}/ 气温：${one.night.weather.temperature}`
//               let textWeather3 = `后天:${two.date}天气：${two.day.weather.info}/ 气温：${two.day.weather.temperature}/ 后天稍晚天气：${two.night.weather.info}/ 气温：${two.night.weather.temperature}`
//               console.log(textWeather,textWeather2);
//               room.say(textWeather)
//               room.say(textWeather2)
//               room.say(textWeather3)
//               return
//             }
//             room.say('查询失败，请检查格式？格式：天气加{省份}加{城市} -- 来自赵苗条的专属机器人回复...')
//             return
//           }
//           room.say('其他好玩功能抓紧学习中... -- 来自赵苗条的专属机器人回复...')
//         }else {
//           // @ 后没有实质内容
//           room.say('宝子找我干嘛呀?^^^来自赵苗条的专属机器人回复...^^^')
//         }
//         return
//       }
//       //  群内其他人 @ 我
//       if (content.startsWith('@机器人明明')) {
//
//         console.log(content);
//         // room.say(`爱卿-${nameText}-@朕，何事，速速说来...`)
//         if (content.length > 4) {
//           let boxText = content.substr(5,content.length)
//           if (content.includes('查天')) {
//             room.say('查询哪里的天气的呢？格式：天气加省份加城市 -- 请爱卿知晓...')
//             return
//           }
//           if (content.includes('天气')) {
//             let newBoxText =  boxText.split('加')
//             console.log(newBoxText);
//             let url = `https://www.wjmwjh.top:8000/wx/weather/${newBoxText[1]}/${newBoxText[2]}`
//             let weatherData = await koaRequest(encodeURI(url));
//             let newWeatherData = JSON.parse(weatherData.body)
//             if (newWeatherData.msg === 'success') {
//               const { data } = newWeatherData || {}
//               const { real,predict } = data || {}
//               const { detail } = predict || {}
//               const { publish_time, weather,wind } = real || {}
//               const { temperature, feelst, info, humidity } = weather || {}
//               const { direct, power} = wind || {}
//               let textWeather = `实时：${publish_time}/ 天气：${info}/ 温度：${temperature}摄氏度/ 体感温度：${feelst}摄氏度/ 湿度：${humidity}/ 风向：${direct}/ 风力：${power}`
//               let one = detail[1]
//               let two = detail[2]
//               let textWeather2 = `明天:${one.date}天气：${one.day.weather.info}/ 气温：${one.day.weather.temperature}/ 明天稍晚天气：${one.night.weather.info}/ 气温：${one.night.weather.temperature}`
//               let textWeather3 = `后天:${two.date}天气：${two.day.weather.info}/ 气温：${two.day.weather.temperature}/ 后天稍晚天气：${two.night.weather.info}/ 气温：${two.night.weather.temperature}`
//               console.log(textWeather,textWeather2);
//               room.say(textWeather)
//               room.say(textWeather2)
//               room.say(textWeather3)
//               return
//             }
//             room.say('查询失败，请检查格式？格式：天气加{省份}加{城市} -- 请爱卿知晓...')
//             return
//           }
//           room.say('其他好玩功能朕抓紧学习中... -- 请爱卿知晓...')
//         }else {
//           // @ 后没有实质内容
//           room.say(`爱卿${nameText}@朕何事?----请爱卿知晓...^^^`)
//         }
//       }
//     }
//
//
//
//   } else if (isText) {
//     // 如果非群消息 目前只处理文字消息
//     console.log(`发消息人: ${alias} 消息内容: ${content}`);
//     // if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
//     //   let contactContent = content.replace('?', '').replace('？', '');
//     //   if (contactContent) {
//     //     let res = await superagent.getRubbishType(contactContent);
//     //     await delay(2000);
//
//     //     await contact.say(res);
//     //   }
//     // } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
//     //   // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
//     //   if (content) {
//     //     let reply;
//     //     if (config.DEFAULTBOT == '0') {
//     //       // 天行聊天机器人逻辑
//     //       reply = await superagent.getReply(content);
//     //       console.log('天行机器人回复：', reply);
//     //     } else if (config.DEFAULTBOT == '1') {
//     //       // 图灵聊天机器人
//     //       reply = await superagent.getTuLingReply(content);
//     //       console.log('图灵机器人回复：', reply);
//     //     } else if (config.DEFAULTBOT == '2') {
//     //       // 天行对接的图灵聊
//     //       reply = await superagent.getTXTLReply(content);
//     //       console.log('天行对接的图灵机器人回复：', reply);
//     //     }
//     //     try {
//     //       await delay(2000);
//     //       await contact.say(reply);
//     //     } catch (e) {
//     //       console.error(e);
//     //     }
//     //   }
//     // }
//   }
// }
