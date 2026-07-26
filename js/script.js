const cityInput=document.getElementById("cityInput");
const searchBTn=document.getElementById("searchBtn");
const city=document.querySelector(".city");
const date=document.querySelector(".date");
const temp=document.querySelector(".temp");
const feels=document.querySelector(".feels");
const condition=document.querySelector(".condition");
const humidity=document.querySelector(".humidity");
const wind=document.querySelector(".wind");
const rain=document.querySelector(".rain");
const weathericon=document.querySelector(".weather-icon img");
const hourlyContainer=document.querySelector(".hourly-container");
const dailyContainer=document.querySelector(".daily-container");
const loading=document.querySelector(".loading");

const API_KEY="655542b8fca279fa9806a14309589273";
const BASE_URL="https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL="https://api.openweathermap.org/data/2.5/forecast";

searchBTn.addEventListener("click",async()=>{
    const cityname=cityInput.value.trim();
    if(cityname===""){
        alert("please enter a city name");
        return;
    }
    loading.style.display="flex";
    await getWeather(cityname);
    await getForecast(cityname);
    loading.style.display="none";
})
 async function getWeather(cityname) {
        try{
        const url=`${BASE_URL}?q=${cityname}&appid=${API_KEY}&units=metric`;
       
        const response=await fetch(url);
        if(!response.ok){
            throw new Error("city not found");
        }
       
        const data=await response.json();
        const today=new Date();
        date.innerText=today.toLocaleDateString("en-US",{
            weekday:"long",
            day:"numeric",
            month:"long"
        });
        city.innerText=data.name;
        temp.innerText=`${Math.round(data.main.temp)}°`;
        feels.innerText=`Feels like ${Math.round(data.main.feels_like)}°`
        condition.innerText=data.weather[0].main;
        humidity.innerText=`${data.main.humidity}%`;
        wind.innerText=`${data.wind.speed}m/s`;
       
        const icon=data.weather[0].icon;
        weathericon.src=`https://openweathermap.org/img/wn/${icon}@2x.png`; 
 }

 catch(error){
  
    alert(error.message);
 }
}
cityInput.addEventListener("keypress",(e)=>{
    if(e.key=="Enter"){
        searchBTn.click();
    }
})
async function getForecast(cityname) {
    try{
    const url=`${FORECAST_URL}?q=${cityname}&appid=${API_KEY}&units=metric`;
    const response=await fetch(url);
    const data=await response.json();
    const firstforecast=data.list[0];
    rain.innerText=firstforecast.rain?`${firstforecast.rain["3h"]}mm`:"0mm";
    hourlyContainer.innerHTML="";
    for(let i=0;i<4;i++){
        const forecast=data.list[i];
        const hourCard=document.createElement("div");
        hourCard.classList.add("hour-card");
        const dateObj = new Date(forecast.dt_txt);
        const time=dateObj.toLocaleTimeString([],{
            hour:"numeric",
            hour12:true
        });
     
        const icon=forecast.weather[0].icon;
        const temp=Math.round(forecast.main.temp);
        hourCard.innerHTML=`<p>${time}</p> <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather"><span> ${temp}°</span>`;

        hourlyContainer.appendChild(hourCard);
    }
  
    dailyContainer.innerHTML="";
    for(const forecast of data.list){
        if(forecast.dt_txt.includes("12:00:00")){
            const daycard=document.createElement("div");
            daycard.classList.add("day-card");
             const date=new Date(forecast.dt_txt);
            const day=date.toLocaleDateString("en-US",{
                weekday:"long"
            });
            const icon=forecast.weather[0].icon;
            const maxTemp=Math.round(forecast.main.temp_max);
            const minTemp=Math.round(forecast.main.temp_min);

            daycard.innerHTML=`<p>${day}</p><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather">
            <div clas="temps"><span class="min-temp"> ${minTemp}°</span></div>`;

            dailyContainer.appendChild(daycard);
        }
    }
}
    catch(error){
        console.error(error);
        alert("Unable to load forecast.");
    }
}
getWeather("jhansi");
getForecast("jhansi");