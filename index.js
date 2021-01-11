const http = require("http");
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, OrignalVal)=>{
    const num = OrignalVal.main.temp; 
    const minTemp = OrignalVal.main.temp_min;
    const maxTemp = OrignalVal.main.temp_max;
    console.log((num -273).toFixed(2))
      let  temperature = tempVal.replace("{%CityName%}", OrignalVal.name);
           temperature = temperature.replace("{%tempVal%}",(num - 273).toFixed(2));
           temperature = temperature.replace("{%tempStatus%}",OrignalVal.weather[0].main);
           temperature = temperature.replace("{%tempMin%}",(minTemp - 273).toFixed(2));
           temperature = temperature.replace("{%tempMax%}",(maxTemp - 273).toFixed(2));
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("{api.openweathermap.org} KEY")
        .on('data', (chunk)=> {
            const ObjData = JSON.parse(chunk);
            const arrData = [ObjData]
            // const num = arrData[0].main.temp;
            // console.log((num - 273).toFixed(2))
            const realTimeData = arrData
            .map((val)=> replaceVal(homeFile,val))
            .join("")
                // console.log(arrData)
                res.write(realTimeData);
            })
        .on('end', (err)=> {
            if (err) return console.log('connection closed due to errors', err);
             res.end();
        });

    }
});

server.listen(3000, "127.0.0.1");
