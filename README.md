# Weather Project

A weather application that displays current weather and forecast information using the OpenWeatherMap API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root and add your OpenWeatherMap API key:
```
VITE_API_KEY=your_api_key_here
```

You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api).

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

## Security

The API key is stored in a `.env` file which is automatically excluded from version control via `.gitignore`. Make sure to:
- Use the `.env.example` file as a template for your own `.env` file
- Keep your API key secure and never share it publicly
