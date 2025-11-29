# Carbon Compass - Frontend
## Uses React and Vite
This is the client-side application for Carbon Compass. It handles the UI, the routes to call the backend with, and the display of trips, directions, emissions, and AQIs. 

## Built with:
- React + Vite
- Fetch
- React95 (Windows 95 theme)

## Setup
### Install dependencies
```commandline
cd frontend
npm install
```

### Run the development server
```commandline
npm run dev
```

By default, the server runs at:
```
http://localhost:5173
```

## Environment Variables
Create a `.env` file inside `frontend/`:
```
VITE_GOOGLE_MAPS_KEY=(The same Google Maps key as the backend)
```