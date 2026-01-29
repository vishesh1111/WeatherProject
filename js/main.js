// Weather App - Main JavaScript
// API Configuration
const apiKey = '1e3e8f230b6064d27976e41163a82b77';
const DEFAULT_CITY = "New Delhi";

// Global state
let currentWeatherData = null;

// Utility Functions

// Format time from timestamp
function formatTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
}

// Update live time
function updateLiveTime() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    
    if (timeEl && dateEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        dateEl.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Show loading state
function showLoading() {
    const cityName = document.getElementById("city-name");
    const metric = document.getElementById("metric");
    if (cityName) cityName.innerHTML = "Loading...";
    if (metric) metric.innerHTML = "...";
}

// Get weather tips based on conditions
function getWeatherTip(weather, temp) {
    const tips = {
        rain: [
            "☔ Don't forget your umbrella today!",
            "🌧️ Perfect day for indoor activities",
            "💧 Rain expected - drive carefully!"
        ],
        clear: [
            "☀️ Great day for outdoor activities!",
            "🕶️ Don't forget your sunglasses",
            "🧴 Apply sunscreen if going out"
        ],
        clouds: [
            "☁️ Mild weather - enjoy the calm skies",
            "🌤️ A light jacket might be useful",
            "📸 Great lighting for photography!"
        ],
        snow: [
            "❄️ Bundle up and stay warm!",
            "🧥 Layer your clothes today",
            "☃️ Perfect weather for hot chocolate"
        ],
        thunderstorm: [
            "⛈️ Stay indoors if possible",
            "🏠 Avoid outdoor activities today",
            "Unplug sensitive electronics"
        ],
        mist: [
            "🌫️ Low visibility - drive with caution",
            "🚗 Use fog lights while driving",
            "👓 Wear glasses to protect your eyes"
        ],
        haze: [
            "😷 Consider wearing a mask outdoors",
            "🏠 Keep windows closed today",
            "💨 Air quality may be poor"
        ]
    };
    
    const condition = weather.toLowerCase();
    const tipArray = tips[condition] || tips.clear;
    
    // Add temperature-based tips
    if (temp > 35) {
        return "🥵 It's very hot! Stay hydrated and avoid direct sun";
    } else if (temp < 5) {
        return "🥶 It's freezing! Wear multiple layers and keep warm";
    }
    
    return tipArray[Math.floor(Math.random() * tipArray.length)];
}

// ============================================
// WEATHER ICON FUNCTION
// ============================================

function getWeatherIcon(condition) {
    const iconMap = {
        "rain": "img/rain.png",
        "drizzle": "img/rain.png",
        "clear": "img/sun.png",
        "clear sky": "img/sun.png",
        "snow": "img/snow.png",
        "clouds": "img/cloud.png",
        "smoke": "img/cloud.png",
        "mist": "img/mist.png",
        "fog": "img/mist.png",
        "haze": "img/haze.png",
        "dust": "img/haze.png",
        "thunderstorm": "img/thunderstorm.png"
    };
    return iconMap[condition.toLowerCase()] || "img/sun.png";
}

// ============================================
// FETCH WEATHER FUNCTIONS
// ============================================

async function fetchWeatherByCity(cityName) {
    showLoading();
    
    try {
        // Fetch forecast data
        let url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${cityName}&appid=${apiKey}`;
        let respond = await fetch(url);
        
        if (!respond.ok) {
            throw new Error(`Weather API error: ${respond.status} ${respond.statusText}`);
        }
        
        let data = await respond.json();
        currentWeatherData = data;
        
        // Also fetch current weather for additional data
        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`;
        let currentRespond = await fetch(currentUrl);
        let currentData = await currentRespond.json();
        
        displayWeatherData(data, currentData);
        displayForecast(data);
        displayHourlyForecast(data);
        
    } catch (error) {
        console.error("An error occurred:", error);
        const cityNameEl = document.getElementById("city-name");
        const metric = document.getElementById("metric");
        if (cityNameEl) cityNameEl.innerHTML = "City not found";
        if (metric) metric.innerHTML = "N/A";
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
        await fetchWeatherByCity(DEFAULT_CITY);
        return;
    }
    
    try {
        // Fetch forecast data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const respond = await fetch(weatherUrl);
        
        if (!respond.ok) {
            throw new Error(`Weather API error: ${respond.status} ${respond.statusText}`);
        }
        
        const data = await respond.json();
        currentWeatherData = data;
        
        // Also fetch current weather for additional data
        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        let currentRespond = await fetch(currentUrl);
        let currentData = await currentRespond.json();
        
        displayWeatherData(data, currentData);
        displayForecast(data);
        displayHourlyForecast(data);
        
    } catch (error) {
        console.error("Error fetching weather:", error);
        await fetchWeatherByCity(DEFAULT_CITY);
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function displayWeatherData(data, currentData = null) {
    // Basic elements
    const cityMain = document.getElementById("city-name");
    const countryCode = document.getElementById("country-code");
    const cityTemp = document.getElementById("metric");
    const weatherMain = document.querySelectorAll("#weather-main");
    const mainHumidity = document.getElementById("humidity");
    const mainFeel = document.getElementById("feels-like");
    const weatherImg = document.querySelector(".weather-icon");
    const weatherImgs = document.querySelector(".weather-icons");
    const tempMinWeather = document.getElementById("temp-min-today");
    const tempMaxWeather = document.getElementById("temp-max-today");
    
    // New elements
    const windSpeed = document.getElementById("wind-speed");
    const visibility = document.getElementById("visibility");
    const pressure = document.getElementById("pressure");
    const clouds = document.getElementById("clouds");
    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");
    const tipText = document.getElementById("tip-text");
    const sunProgressBar = document.getElementById("sun-progress-bar");
    const sunIndicator = document.getElementById("sun-indicator");

    // Display basic data
    if (cityMain) cityMain.innerHTML = data.city.name;
    if (countryCode) countryCode.innerHTML = data.city.country;
    if (cityTemp) cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
    
    weatherMain.forEach(el => {
        if (el) el.innerHTML = data.list[0].weather[0].description;
    });
    
    if (mainHumidity) mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
    if (mainFeel) mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
    if (tempMinWeather) tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
    if (tempMaxWeather) tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

    // Weather icon
    const weatherCondition = data.list[0].weather[0].main.toLowerCase();
    const imgSrc = getWeatherIcon(weatherCondition);
    if (weatherImg) weatherImg.src = imgSrc;
    if (weatherImgs) weatherImgs.src = imgSrc;

    // Additional weather stats
    if (windSpeed) windSpeed.innerHTML = Math.round(data.list[0].wind.speed * 3.6); // Convert m/s to km/h
    if (visibility && data.list[0].visibility) {
        visibility.innerHTML = Math.round(data.list[0].visibility / 1000);
    }
    if (pressure) pressure.innerHTML = data.list[0].main.pressure;
    if (clouds) clouds.innerHTML = data.list[0].clouds.all;

    // Sunrise/Sunset from current weather data or city data
    if (currentData && currentData.sys) {
        const timezone = currentData.timezone || 0;
        if (sunrise) sunrise.innerHTML = formatTime(currentData.sys.sunrise, timezone);
        if (sunset) sunset.innerHTML = formatTime(currentData.sys.sunset, timezone);
        
        // Calculate sun progress
        const now = Date.now() / 1000;
        const sunriseTime = currentData.sys.sunrise;
        const sunsetTime = currentData.sys.sunset;
        const dayLength = sunsetTime - sunriseTime;
        const elapsed = now - sunriseTime;
        let progress = Math.max(0, Math.min(100, (elapsed / dayLength) * 100));
        
        if (sunProgressBar) sunProgressBar.style.width = progress + '%';
        if (sunIndicator) {
            sunIndicator.style.left = progress + '%';
            sunIndicator.innerHTML = progress < 50 ? '☀️' : '🌅';
        }
    }

    // Weather tip
    if (tipText) {
        const tip = getWeatherTip(weatherCondition, data.list[0].main.temp);
        tipText.innerHTML = tip;
    }
}

function displayForecast(data) {
    const dailyForecasts = {};
    const forecast = document.getElementById('future-forecast-box');
    let forecastbox = "";

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const day = new Date(date).getDay();

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                day_today: dayName[day],
                temperature: Math.floor(item.main.temp) + "°",
                description: item.weather[0].description,
                weatherImg: item.weather[0].main.toLowerCase()
            };
        }
    });

    let count = 0;
    for (const date in dailyForecasts) {
        if (count >= 6) break;
        const imgSrc = getWeatherIcon(dailyForecasts[date].weatherImg);

        forecastbox += `
        <div class="weather-forecast-box">
            <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
            </div>
            <div class="weather-icon-forecast">
                <img src="${imgSrc}" alt="weather" />
            </div>
            <div class="temp-weather">
                <span>${dailyForecasts[date].temperature}</span>
            </div>
            <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
        </div>`;
        count++;
    }

    if (forecast) forecast.innerHTML = forecastbox;
}

function displayHourlyForecast(data) {
    const hourlyBox = document.getElementById('hourly-forecast-box');
    if (!hourlyBox) return;
    
    let hourlyHTML = "";
    const now = new Date();
    
    // Get next 8 hours
    for (let i = 0; i < Math.min(8, data.list.length); i++) {
        const item = data.list[i];
        const time = new Date(item.dt * 1000);
        const imgSrc = getWeatherIcon(item.weather[0].main);
        const isCurrentHour = i === 0;
        
        hourlyHTML += `
        <div class="hourly-item ${isCurrentHour ? 'current' : ''}">
            <div class="hourly-time">${isCurrentHour ? 'Now' : time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })}</div>
            <div class="hourly-icon">
                <img src="${imgSrc}" alt="weather" />
            </div>
            <div class="hourly-temp">${Math.floor(item.main.temp)}°</div>
        </div>`;
    }
    
    hourlyBox.innerHTML = hourlyHTML;
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupSearch() {
    const searchInput = document.getElementById("main-search-input");
    const searchBtn = document.getElementById("main-search-btn");
    const refreshBtn = document.getElementById("refresh-location-btn");
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener("click", () => {
            const city = searchInput.value.trim();
            if (city) {
                fetchWeatherByCity(city);
                searchInput.value = "";
            }
        });
        
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const city = searchInput.value.trim();
                if (city) {
                    fetchWeatherByCity(city);
                    searchInput.value = "";
                }
            }
        });
    }
    
    // Refresh location button
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            requestLocation();
        });
    }
}

// ============================================
// THEME TOGGLE
// ============================================

function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('weatherTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('weatherTheme', isDark ? 'dark' : 'light');
    });
}

// ============================================
// LOCATION FUNCTIONS
// ============================================

function requestLocation() {
    console.log("requestLocation called");
    
    showLoading();
    const cityName = document.getElementById("city-name");
    if (cityName) cityName.innerHTML = "Getting your location...";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function successCallback(position) {
                console.log("Browser geolocation success!");
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            function errorCallback(error) {
                console.log("Browser geolocation failed, trying IP-based location...");
                getLocationByIP();
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 60000
            }
        );
    } else {
        getLocationByIP();
    }
}

async function getLocationByIP() {
    try {
        const response = await fetch('http://ip-api.com/json/?fields=status,city,lat,lon');
        const data = await response.json();
        
        if (data.status === 'success' && data.lat && data.lon) {
            fetchWeatherByCoords(data.lat, data.lon);
        } else {
            throw new Error("IP location failed");
        }
    } catch (error) {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.latitude && data.longitude) {
                fetchWeatherByCoords(data.latitude, data.longitude);
            } else {
                throw new Error("Alternative IP location failed");
            }
        } catch (err) {
            console.error("All location methods failed:", err);
            fetchWeatherByCity(DEFAULT_CITY);
        }
    }
}

// ============================================
// LOCATION MODAL
// ============================================

function showLocationModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'location-modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95));
        padding: 45px 40px;
        border-radius: 35px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35);
        animation: slideUp 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 1px solid rgba(255, 255, 255, 0.5);
    `;

    modal.innerHTML = `
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        </style>
        <div style="
            font-size: 80px; 
            margin-bottom: 25px;
            animation: bounce 2s ease-in-out infinite;
        ">🌍</div>
        <h2 style="
            color: #1a1a2e; 
            margin-bottom: 15px;
            font-size: 26px;
            font-weight: 700;
        ">Enable Location</h2>
        <p style="
            color: #666; 
            margin-bottom: 35px; 
            font-size: 15px;
            line-height: 1.6;
        ">
            Get accurate weather for your current location, or explore weather worldwide!
        </p>
        <div style="display: flex; flex-direction: column; gap: 14px;">
            <button id="allow-location-btn" style="
                background: linear-gradient(135deg, #6c63ff, #3b82f6);
                color: white;
                border: none;
                padding: 18px 45px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 12px 35px rgba(108, 99, 255, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            "><i class="fa-solid fa-location-crosshairs"></i> Allow Location</button>
            <button id="skip-location-btn" style="
                background: transparent;
                color: #666;
                border: 2px solid #e0e0e0;
                padding: 16px 45px;
                border-radius: 50px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Maybe Later</button>
        </div>
    `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    const allowBtn = document.getElementById('allow-location-btn');
    const skipBtn = document.getElementById('skip-location-btn');
    
    allowBtn.addEventListener('mouseenter', () => {
        allowBtn.style.transform = 'translateY(-3px) scale(1.02)';
        allowBtn.style.boxShadow = '0 18px 45px rgba(108, 99, 255, 0.5)';
    });
    allowBtn.addEventListener('mouseleave', () => {
        allowBtn.style.transform = 'translateY(0) scale(1)';
        allowBtn.style.boxShadow = '0 12px 35px rgba(108, 99, 255, 0.4)';
    });
    
    skipBtn.addEventListener('mouseenter', () => {
        skipBtn.style.background = '#f5f5f5';
        skipBtn.style.borderColor = '#ccc';
    });
    skipBtn.addEventListener('mouseleave', () => {
        skipBtn.style.background = 'transparent';
        skipBtn.style.borderColor = '#e0e0e0';
    });

    allowBtn.addEventListener('click', () => {
        modalOverlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            modalOverlay.remove();
            requestLocation();
        }, 250);
    });

    skipBtn.addEventListener('click', () => {
        modalOverlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            modalOverlay.remove();
            fetchWeatherByCity(DEFAULT_CITY);
        }, 250);
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    setupSearch();
    setupThemeToggle();
    showLoading();
    
    // Update time every second
    updateLiveTime();
    setInterval(updateLiveTime, 1000);
    
    // Show location permission modal
    showLocationModal();
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
