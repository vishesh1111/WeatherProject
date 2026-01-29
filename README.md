# Weather Project

A weather application that displays current weather and forecast information using the OpenWeatherMap API.

## Features

- **Current Location Weather**: Automatically detects your location using browser geolocation API and displays current weather
- **6-Day Forecast**: View weather forecasts for the next 6 days
- **City Search**: Search for weather information by city name
- **World Weather**: Add and track weather for multiple cities around the world

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get an OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key

### 3. Configure Your API Key

Create a `.env` file in the project root directory:

```bash
cp .env.example .env
```

Then edit the `.env` file and replace `your_api_key_here` with your actual OpenWeatherMap API key:

```
VITE_API_KEY=your_actual_api_key_here
```

**Important**: 
- Make sure your `.env` file is in the root directory of the project
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- Your API key should be kept private and not shared publicly

### 4. Enable Location Access

When you first visit the main page (`index.html`), your browser will ask for permission to access your location. Click "Allow" to enable the app to show weather for your current location.

If you accidentally denied location access:
- **Chrome/Edge**: Click the lock icon in the address bar → Site settings → Location → Allow
- **Firefox**: Click the lock icon → Clear permissions and settings → Refresh the page
- **Safari**: Preferences → Websites → Location → Allow for this website

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

**Note**: Make sure you have configured your `.env` file with a valid API key before running the development server.

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

## Troubleshooting

### Weather data is not loading

1. **Check your API key**: Make sure your `.env` file exists and contains a valid OpenWeatherMap API key
2. **Restart the dev server**: After creating or modifying the `.env` file, restart the development server
3. **Check browser console**: Open browser developer tools (F12) and check the console for error messages
4. **Verify API key is active**: New OpenWeatherMap API keys can take a few minutes to activate

### Location not working

1. **Enable location permissions**: Check that your browser has permission to access your location
2. **Use HTTPS or localhost**: Geolocation API only works on secure contexts (HTTPS) or localhost
3. **Check browser compatibility**: Make sure your browser supports the Geolocation API (all modern browsers do)

### API errors

- **401 Unauthorized**: Your API key is invalid or not activated yet
- **404 Not Found**: The city name might be misspelled or not found
- **429 Too Many Requests**: You've exceeded the free tier limit (60 calls/minute)

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

## Security

The API key is stored in a `.env` file which is automatically excluded from version control via `.gitignore`. Make sure to:
- Use the `.env.example` file as a template for your own `.env` file
- Keep your API key secure and never share it publicly
