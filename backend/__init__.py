import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]
RAPIDAPI_KEY: str = os.environ["RAPIDAPI_KEY"]
GOOGLE_MAPS_API_KEY: str = os.environ["GOOGLE_MAPS_API_KEY"]
FRONTEND_ORIGINS: str | None = os.environ.get("FRONTEND_ORIGINS")
