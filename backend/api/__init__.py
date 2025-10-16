from backend.api.stops import stops_bp
from backend.api.trips import trips_bp
from backend.api.users import users_bp

from dotenv import load_dotenv
load_dotenv()

__all__ = ["stops_bp", "trips_bp", "users_bp"]
