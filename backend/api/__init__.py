import os
from dotenv import load_dotenv

from .stops import stops_bp
from .trips import trips_bp
from .users import users_bp
from .emissions import emissions_bp

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, '.env'))
load_dotenv(dotenv_path=dotenv_path)

__all__ = ["stops_bp", "trips_bp", "users_bp", "emissions_bp"]
