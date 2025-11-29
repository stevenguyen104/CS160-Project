# CS160-Project - Carbon Compass

## Vision Statement
For environmentally conscious travelers, commuters, and individuals who need a simple way to understand and reduce the environmental impact of their trips, the **Carbon Compass** is an intuitive web-based trip planner that tracks carbon emissions, visualizes historical environmental data, and provides suggestions to encourage eco-friendly travel decisions. Unlike popular mapping services that mainly prioritize speed and convenience, such as Google Maps, our web application aims to rank routes based on the estimated carbon emissions and allows for the consideration of other environmental impacts.

## Features
- Login system via Supabase Auth
- Storing trips via Supabase
- User preferences
- Route directions
- Emissions estimates
- Air Quality Index (AQI) alerts

## Project Structure
```
.
├── CS160-Project/
    ├── backend/
    ├── frontend/
    ├── README.md
```

## Requirements
- Python 3.13 
  - Virtual environment highly recommended
- Node.js

## Setup
### Install dependencies
```commandline
cd backend
pip install -r requirements.txt
cd ../frontend
npm install
cd ..
```

### Build frontend assets
```commandline
cd frontend
npm run build
cd ..
```
### Run the server
```commandline
python -m backend.app
```
The server runs at:
```
http://127.0.0.1:5000
```

# Environment Variables
### Backend
Create a `.env` file inside `backend/`:
```
SUPABASE_URL=(Supabase URL)
SUPABASE_KEY=(The public Supabase key)
RAPIDAPI_KEY=(your Rapid API key)
GOOGLE_MAPS_API_KEY=(your Google Maps API key)
```

### Frontend
Create a `.env` file inside `frontend/`:
```
VITE_GOOGLE_MAPS_KEY=(The same Google Maps key)
```