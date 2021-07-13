
const koaRequest = require('koa2-request')

async function weatherApi (newBoxText){
    let url = `https://www.wjmwjh.top:8000/wx/weather/${newBoxText[1]}/${newBoxText[2]}`
    let weatherData = await koaRequest(encodeURI(url));
    let newWeatherData = JSON.parse(weatherData.body)
    let textWeather1 = []
    let textWeather2= []
    let textWeather3= []
    if (newWeatherData.msg === 'success') {
        const {data} = newWeatherData || {}
        const {real, predict} = data || {}
        const {detail} = predict || {}
        const {publish_time, weather, wind} = real || {}
        const {temperature, feelst, info, humidity} = weather || {}
        const {direct, power} = wind || {}
        textWeather1 = `实时：${publish_time}<br>天气：${info}<br>温度：${temperature}摄氏度<br>体感温度：${feelst}摄氏度<br>湿度：${humidity}<br>风向：${direct}/ 风力：${power}`
        let one = detail[1]
        let two = detail[2]
        textWeather2 = `明天:${one.date}<br>天气：${one.day.weather.info}<br>气温：${one.day.weather.temperature}<br>明天稍晚天气：${one.night.weather.info}<br>气温：${one.night.weather.temperature}`
        textWeather3 = `后天:${two.date}<br>天气：${two.day.weather.info}<br>气温：${two.day.weather.temperature}<br>后天稍晚天气：${two.night.weather.info}<br>气温：${two.night.weather.temperature}`
    }
    return {textWeather1,textWeather2,textWeather3}
}

module.exports ={
    weatherApi
}