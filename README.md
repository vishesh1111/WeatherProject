# Weather Project

A weather application that displays current weather and forecast information using the OpenWeatherMap API. The app uses your browser's geolocation to automatically detect your location and display relevant weather data.

## Features

- **Automatic Location Detection**: Uses browser geolocation to detect your current location
- **Current Weather Display**: Shows temperature, weather conditions, humidity, and feels-like temperature
- **6-Day Forecast**: Displays weather predictions for the next 6 days
- **City Search**: Search weather by city name (on search page)
- **World Weather**: Track multiple cities (on world page)

## Setup

### Prerequisites

1. Node.js and npm installed on your system
2. An OpenWeatherMap API key (free tier available)
3. A modern web browser with geolocation support

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your API key:**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your account dashboard
   - **Note**: It may take a few minutes for your API key to activate

3. **Configure the API key:**
   - Copy the `.env.example` file to create a new `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and replace `your_api_key_here` with your actual OpenWeatherMap API key:
     ```
     VITE_API_KEY=your_actual_api_key_here
     ```
   - **Important**: Never commit the `.env` file to version control

4. **Enable location permissions:**
   - When you first visit the website, your browser will ask for location permission
   - Click "Allow" to enable automatic location detection
   - If you deny permission, the app will show an error message

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build

Build the production version:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

Preview the production build:
```bash
npm run preview
```

## Project Structure

- `index.html` - Main page showing weather for current location
- `search.html` - Search page to find weather by city
- `world.html` - World weather page to add and view multiple cities
- `js/` - JavaScript files
  - `main.js` - Main page logic
  - `search.js` - Search page logic
  - `world.js` - World page logic
- `css/` - Stylesheets
- `img/` - Images and weather icons


## Troubleshooting

### Location Permission Issues

If the app cannot access your location:

1. **Check browser permissions**: 
   - Chrome: Click the lock icon in the address bar → Site settings → Location → Allow
   - Firefox: Click the shield icon → Permissions → Location → Allow
   - Safari: Safari menu → Settings for This Website → Location → Allow

2. **Refresh the page** after granting permission

3. **Check if location services are enabled** on your device

### API Key Issues

If weather data is not loading:

1. **Verify your API key** is correct in the `.env` file
2. **Wait a few minutes** - new API keys can take 10-15 minutes to activate
3. **Check the console** for detailed error messages (F12 to open developer tools)
4. **Ensure the .env file** is in the project root directory, not in a subdirectory

### Error Messages

- **"Weather API key is not configured"**: Your `.env` file is missing or the API key is still set to the default placeholder
- **"Please grant location permission and refresh the page"**: Browser location permission was denied
- **"Failed to fetch weather data"**: API key might be invalid, not yet activated, or there's a network issue

## Security

The API key is stored in a `.env` file which is automatically excluded from version control via `.gitignore`. Make sure to:
- Use the `.env.example` file as a template for your own `.env` file
- Keep your API key secure and never share it publicly
