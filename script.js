const your_weather =document.querySelector('[user_weather]');
const search_weather =document.querySelector('[search_weather]');
const grant_access_btn=document.querySelector('[grant_access_btn]');
const btn_for_search=document.getElementsByClassName('btn');
const grant_location=document.querySelector('.grant_location');
const search_form=document.querySelector('.search_form');
const weather_info_container=document.querySelector('.weather_info_container');
const loader=document.querySelector('.loading');










// initialization:

let current_tab=your_weather;
let api_key="d1845658f92b31c64bd94f06f7188c9c";
current_tab.classList.add('current_tab');

// imp and initial thing that ho skta ha ka mery web browser(sessionStorage) ma pehly sa hi coodinates 
// pary ho, to is ka matlab mujy coordinates find krny ki need nai
// so ma ek dafa getFromSectionStorage call kr dta ho
getFromSectionStorage();

function switch_weather(clicked_weather){
    if(clicked_weather!=current_tab){
        current_tab.classList.remove('current_tab');
        current_tab=clicked_weather;
        current_tab.classList.add('current_tab');

        // using active class I will active either search or your weather

        if(!search_form.classList.contains('active')){
            grant_location.classList.remove('active');
            weather_info_container.classList.remove('active');
            search_form.classList.add('active');

        }
        else{
            search_form.classList.remove('active');
            weather_info_container.classList.remove('active');
            getFromSectionStorage();
        }



    }
    
}

your_weather.addEventListener('click',function(){
    switch_weather(your_weather);
});
search_weather.addEventListener('click',function(){
    switch_weather(search_weather);
});

function getFromSectionStorage(){
    const localStorage= sessionStorage.getItem('user-coordinates');
    if(!localStorage){
        //display grant access location, active it
        grant_location.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localStorage);//string ma mily ga is liya
        fetchUserWeatherIno(coordinates);
    }
}
//as is ma hum api call kry ga to hum is ko async banai ga
async function fetchUserWeatherIno(coordinates){
    //calculate lon,lat
    const {lon,lat}=coordinates;
    //api call krny sa pehly loader show kro
    loader.classList.add('active');
    // console.log(coordinates.lat);
    // console.log(coordinates.lon);

    //api call:
    try{    

        

        
        // const response = await Promise.race([
        //     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`),
        //     new Promise((resolve, reject) => setTimeout(() => reject(new Error('Request timed out')), 10000))
        // ]);

        // const data=await response.json(); //response ka andar promise aya ha to hum usy json ma convert kry ga
        // // console.log(data);
        // loader.classList.remove('active');
        // weather_info_container.classList.add('active');
        // renderWeatherData(data);

        const response = await Promise.race([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`),
            new Promise((resolve, reject) => setTimeout(() => reject(new Error('Request timed out')), 10000))
        ]);
        const  data = await response.json();
        // console.log(data);
        grant_location.classList.remove('active');
        loader.classList.remove("active");
        weather_info_container.classList.add("active");
        renderWeatherData(data);
    }
    catch(err){
        loader.classList.remove('active');
        // alert("request time out");
    }

}

function renderWeatherData(data_g){
    // console.log(data_g);

    const city_name=document.querySelector('[data_city_name]');
    const country_img=document.querySelector('[data_country_img]');
    const description=document.querySelector('[data_description]');
    const description_icon=document.querySelector('[data_description_icon]');
    const temp=document.querySelector('[temp]');
    const windSpeed=document.querySelector('[data_windSpeed]');
    const humidity=document.querySelector('[data_humidity]');
    const cloud=document.querySelector('[data_cloud]');
    // console.log(data_g);
    // fetch data that is in json format and access specific object property using 
    // optional chaining operator '?'
    
    city_name.innerText=data_g?.name;//? hum is liya use kr rahy ha ka humy nai pata ka wo name ha ka be nai
    // country_img.src=`http://flagcdn.com/144x188/${data_g?.sys?.country.toLowerCase()}.png`;
    country_img.src = `https://flagcdn.com/144x108/${data_g?.sys?.country.toLowerCase()}.png`;

    description.innerText=data_g?.weather?.[0]?.description;//description is in the form of array
    description_icon.src=`http://openweathermap.org/img/w/${data_g?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data_g?.main?.temp} °C`;
    windSpeed.innerText = `${data_g?.wind?.speed} m/s`;
    humidity.innerText = `${data_g?.main?.humidity}%`;
    cloud.innerText = `${data_g?.clouds?.all}%`;
    // console.log(city_name.innerText);

}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherIno(userCoordinates);
}

function getLocation(){
    if(navigator.geolocation){//agr to geolocation ki support available ha to kiya krna
        navigator.geolocation.getCurrentPosition(showPosition); //show position ek call back function ha
    }
    else{ 
        //alert here that navigator.geolocation not supported
        alert("navigator.geolocation not supported");
    }
}
grant_access_btn.addEventListener('click',getLocation);

// now for search:

const dataSearch_input=document.querySelector('[dataSearch_input]');

search_form.addEventListener('submit',(e)=>{
    e.preventDefault();//this is because submit kiya kry ga ka wo form submit direct kr da ga but hum asa ni chahty
    let city_name=dataSearch_input.value;
    if(city_name===""){
        return;
    }
    else{
        // now ab ma city ki base pr api call kru ga
        fetchWeatherBasedOnCity(city_name);
    }
})

async function fetchWeatherBasedOnCity(city_name){
    loader.classList.add('active');
    weather_info_container.classList.remove('active');

    try{    
        // const response = await fetch(
        //     `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`
        // );

        const response = await Promise.race([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`),
            new Promise((resolve, reject) => setTimeout(() => reject(new Error('Request timed out')), 10000))
        ]);

        const data=await response.json(); //response ka andar promise aya ha to hum usy json ma convert kry ga
        console.log(data);
        loader.classList.remove('active');
        weather_info_container.classList.add('active');
        renderWeatherData(data);
    }
    catch(err){
        loader.classList.remove('active');
        alert("request time out");
        weather_info_container.classList.remove('active');
    }
    

}





