const currentWeather=document.getElementsByClassName("current-conditions");
const forecastDays=document.getElementsByClassName("day");
const dayString={1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday",7:"Sunday",}

const getCurrentWeather=async(location)=>{
    const URL="http://api.openweathermap.org/data/2.5/weather?"+location+"&appid=ada6c43eae0551cb808f5a77926947d4"
    const response = await fetch(URL);
    const data = await response.json();
    if (response.status != 200){
        throw new err ("Can't get data");
    }

    return data;
}

const getForecastWeather=async(location)=>{
    const URL="http://api.openweathermap.org/data/2.5/forecast?"+location+"&appid=ada6c43eae0551cb808f5a77926947d4"
    const response = await fetch(URL);
    const data = await response.json();
    if (response.status != 200){
        throw new err ("Can't get data");
    }

    return data;
}




function renderCurrent(data){
    //console.log(currentWeather[0]);
    currentWeather[0].innerHTML="";
    currentWeather[0].insertAdjacentHTML("afterbegin",`
        <h2>Current Conditions</h2>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
        <div class="current">
            <div class="temp">${Math.round(data.main.temp-273)}℃</div>
            <div class="condition">${data.weather[0].description}</div>
        </div>
    `)
}

function renderForecast(date){
    
    const currentDate=new Date(); 
    date.list.forEach(element=>{
        let testDate=new Date(element.dt*1000);
        if (currentDate.getDate().toString()===testDate.toLocaleDateString('en-US',{day:'numeric'})){
            date.list.pop(element);
        }
    })
    //console.log(date.list);
    for(let i=0;i<5 ;i++){
        forecastDays[i].innerHTML="";
        let newArray=date.list.splice(0,8);
        let index=parseInt(newArray.length/2);
        let maxTemp=newArray[0].main.temp_max;
        let minTemp=newArray[0].main.temp_min;
        newArray.forEach(element=>{
            if (element.main.temp_max>maxTemp){
                maxTemp=element.main.temp_max;
            }

            if (element.main.temp_min<minTemp){
                minTemp=element.main.temp_min;
            }
        })

        let weatherTime=new Date(newArray[index].dt*1000)
        //console.log(weatherTime)
        let weatherDay=weatherTime.getDay();
        //console.log(newArray[index]);
        forecastDays[i].insertAdjacentHTML("afterbegin",`
            <h3>${dayString[weatherDay]}</h3>
            <img src="http://openweathermap.org/img/wn/${newArray[index].weather[0].icon}@2x.png" />
            <div class="description">${newArray[index].weather[0].description}</div>
            <div class="temp">
                <span class="high">${Math.round(maxTemp-273)}℃</span>/<span class="low">${Math.round(minTemp-273)}℃</span>
            </div>
    `)
    }
}
// let index=5;
// for(let i=0;i<index;i++){
//     let dateTime = new Date(data.daily[i].dt*1000);
//     //console.log(data.daily[i].dt);
//     forecastDays[i].innerHTML="";
//     forecastDays[i].insertAdjacentHTML("afterbegin",`
//         <h3>${dayString[dateTime.getDay()]}</h3>
//         <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" />
//         <div class="description">${data.daily[i].weather[0].description}</div>
//         <div class="temp">
//             <span class="high">${Math.round(data.daily[i].temp.max-273)}℃</span>/<span class="low">${Math.round(data.daily[i].temp.min-273)}℃</span>
//         </div>
//     `)

// }


window.addEventListener("load",(e)=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{
            const lat=position.coords.latitude;
            const lon=position.coords.longitude;
            const location="lat="+lat+"&lon="+lon
            getCurrentWeather(location).then((data)=>{renderCurrent(data)}).catch((err)=>{console.log(err)});
            getForecastWeather(location).then((data)=>{renderForecast(data)}).catch((err)=>{console.log(err)});
        })
    }
})

