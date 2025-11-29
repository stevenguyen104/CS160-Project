# Carbon Compass - Backend
## Uses Flask and Supabase
This is the server-side API powering Carbon Compass. It handles authentication, database tables, directions, emissions, and AQI retrieval.

## Built with:
- Flask
- Flask-CORS
- Supabase Python client
- Requests (for external APIs)
- Python 3.13

## Folder structure
```
.
backend/
  ├── api/
  ├── db/
  │   ├── repositories/
  ├── helpers/
  ├── services/
  ├── README.md
```

## Setup
### Install dependencies
```commandline
pip install -r backend/requirements.txt
```

### Run the development server
```commandline
python -m backend.app --debug
```
By default, the server runs at:
```
http://127.0.0.1:5000
```
You can configure the host, port, and frontend origins with:
```
--host
--port
--origins (comma separated)
```

# Environment Variables
Create a `.env` file inside `backend/`:
```
SUPABASE_URL=(Supabase URL)
SUPABASE_KEY=(The public Supabase key)
RAPIDAPI_KEY=(your Rapid API key)
GOOGLE_MAPS_API_KEY=(your Google Maps API key)
```