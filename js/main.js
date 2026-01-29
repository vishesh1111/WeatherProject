let apiKey = import.meta.env.VITE_API_KEY;

// Validate API key
if (!apiKey || apiKey === 'your_api_key_here') {
    alert('Weather API key is not configured. Please create a .env file with VITE_API_KEY. See README.md for instructions.');
    console.error('Missing or invalid API key. Please check your .env file configuration.');
}

// Show loading state
function showLoading() {
    const cityName = document.getElementById("city-name");
    const metric = document.getElementById("metric");
    if (cityName) cityName.innerHTML = "Loading...";
    if (metric) metric.innerHTML = "...";
}

// Check if geolocation is supported
if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser. Please use a modern browser.');
} else {
    showLoading();
    
    navigator.geolocation.getCurrentPosition(async function (position) {
        // calling the browser for geolocation api 
        try {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;    
            //longitude and  latitude are used to get city name
           
            var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
            
            if (!map.ok) {
                throw new Error(`Geocoding API error: ${map.status} ${map.statusText}`);
            }
            
            var userdata = await map.json();
            
            if (!userdata || userdata.length === 0) {
                throw new Error('Unable to determine location from coordinates');
            }
            
            let loc = userdata[0].name;
            //By using City name  we can get the weather details of that particular city from OpenWeatherMap API
            let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
            let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
            
            if (!respond.ok) {
                throw new Error(`Weather API error: ${respond.status} ${respond.statusText}`);
            }
            
            let data = await respond.json();

            console.log(data);
            
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
        } else if (weatherCondition === "mist" || weatherCondition === "Fog") {
            weatherImg.src = "img/mist.png";
            weatherImgs.src = "img/mist.png";
        } else if (weatherCondition === "haze") {
            weatherImg.src = "img/haze.png";
            weatherImgs.src = "img/haze.png";
        } else if (data.weather[0].main === "Thunderstorm") {
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
                        imgSrc = "img/sun.png";
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

                console.log(data);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert(`Error loading weather data: ${error.message}. Please check your API key and internet connection.`);
            
            // Reset to default values on error
            const cityName = document.getElementById("city-name");
            const metric = document.getElementById("metric");
            if (cityName) cityName.innerHTML = "Error";
            if (metric) metric.innerHTML = "N/A";
        }
    },
    (error) => {
        // Handle location retrieval error with more detailed information
        console.error("Geolocation error:", error);
        
        let errorMessage = "Unable to get your location. ";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += "Please enable location access in your browser settings and refresh the page.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += "Location information is unavailable. Please try again later.";
                break;
            case error.TIMEOUT:
                errorMessage += "Location request timed out. Please try again.";
                break;
            default:
                errorMessage += "An unknown error occurred.";
        }
        
        alert(errorMessage);
        
        // Reset to default values on error
        const cityName = document.getElementById("city-name");
        const metric = document.getElementById("metric");
        if (cityName) cityName.innerHTML = "Location Error";
        if (metric) metric.innerHTML = "N/A";
    });
}
