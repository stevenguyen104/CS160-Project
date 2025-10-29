import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY")
RAPIDAPI_KEY: str = os.environ.get("RAPIDAPI_KEY")
GOOGLE_MAPS_API_KEY: str = os.environ.get("GOOGLE_MAPS_API_KEY")
FRONTEND_ORIGINS: str = os.environ.get("FRONTEND_ORIGINS")