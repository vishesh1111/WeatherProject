let apiKey = import.meta.env.VITE_API_KEY;

// Check if API key is configured
if (!apiKey || apiKey === 'your_api_key_here') {
    alert('Weather API key is not configured. Please add your OpenWeatherMap API key to the .env file.');
    console.error('Missing or invalid API key. Please configure VITE_API_KEY in .env file.');
}

// Request user location permission
navigator.geolocation.getCurrentPosition(async function (position) {
    // calling the browser for geolocation api 
    try {
        // Check API key again before making API calls
        if (!apiKey || apiKey === 'your_api_key_here') {
            throw new Error('API key is not configured');
        }

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;    
        console.log(`User location obtained: Latitude ${lat}, Longitude ${lon}`);
        
        //longitude and  latitude are used to get city name
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        
        if (!map.ok) {
            throw new Error(`Failed to fetch location data: ${map.status} ${map.statusText}`);
        }
        
        var userdata = await map.json();
        
        if (!userdata || userdata.length === 0) {
            throw new Error('Unable to determine location from coordinates');
        }
        let loc = userdata[0].name;
        console.log(`Location detected: ${loc}`);
        
        //By using City name  we can get the weather details of that particular city from OpenWeatherMap API
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        
        if (!respond.ok) {
            throw new Error(`Failed to fetch weather data: ${respond.status} ${respond.statusText}`);
        }
        
        let data = await respond.json();

        console.log('Weather data fetched successfully:', data);
        
        // displaying current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");

        cityMain.innerHTML = data.city.name;
        cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
        weatherMain[0].innerHTML = data.list[0].weather[0].description;
        weatherMain[1].innerHTML = data.list[0].weather[0].description;
        mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
        mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
        tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
        tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

       // showing today's max temperature  
       let weatherCondition = data.list[0].weather[0].main.toLowerCase();

        if (weatherCondition === "rain") {
            weatherImg.src = "img/rain.png";
            weatherImgs.src = "img/rain.png";
        } else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
            weatherImg.src = "img/sun.png";
            weatherImgs.src = "img/sun.png";
        } else if (weatherCondition === "snow") {
            weatherImg.src = "img/snow.png";
            weatherImgs.src = "img/snow.png";
        } else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherImg.src = "img/cloud.png";
            weatherImgs.src = "img/cloud.png";
        } else if (weatherCondition === "mist" || weatherCondition === "fog") {
            weatherImg.src = "img/mist.png";
            weatherImgs.src = "img/mist.png";
        } else if (weatherCondition === "haze") {
            weatherImg.src = "img/haze.png";
            weatherImgs.src = "img/haze.png";
        } else if (weatherCondition === "thunderstorm") {
            weatherImg.src = "img/thunderstorm.png";
            weatherImgs.src = "img/thunderstorm.png";
        }

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};

           // creating an empty object used to collect one forecast per date:-
            let forecast = document.getElementById('future-forecast-box');
            let forecastbox = "";

           // initalizes and string that will accumlate the html for all forecast boxes:-
            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let day = new Date(date).getDay();

               // creating a date from the date string & gets the weekly number (0-6)
                if (!dailyForecasts[date]) {
                   // checks if an entry for the date iis not yet stored in daillyforecasts:- 
                   dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

               // switch statement for diff diff cases of weather:-
                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "img/rain.png";
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc = "img/sun.png";9
                        break;
                    case "snow":
                        imgSrc = "img/snow.png";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc = "img/cloud.png";
                        break;
                    case "mist":
                        imgSrc = "img/mist.png";
                        break;
                    case "haze":
                        imgSrc = "img/haze.png";
                        break;
                    case "thunderstorm":
                        imgSrc = "img/thunderstorm.png";
                        break;
                    default:
                        imgSrc = "img/sun.png";
                }

                forecastbox += `
                <div class="weather-forecast-box">
                <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
                 </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;

            console.log('Forecast data displayed successfully');
        }
    } catch (error) {
        console.error("An error occurred while fetching weather data:", error);
        alert(`Unable to fetch weather data: ${error.message}. Please check your API key and internet connection.`);
    }
},
(error) => {
    // Handle location retrieval error
    console.error("Geolocation error:", error);
    
    let errorMessage = "Unable to access your location. ";
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage += "Please grant location permission and refresh the page.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage += "The request to get your location timed out.";
            break;
        default:
            errorMessage += "An unknown error occurred.";
            break;
    }
    
    alert(errorMessage);
});
