from flask import Flask, jsonify
from flask_cors import CORS

from backend.db.supabase_client import supabase
from backend.db.repositories.stop_repository import StopRepository
from backend.db.repositories.trip_repository import TripRepository

from backend.api.stops import stops_bp
from backend.api.trips import trips_bp
from backend.api.users import users_bp

from dotenv import load_dotenv
load_dotenv()


def create_app(origins: list[str] = None) -> Flask:
    app = Flask(__name__)
    CORS(app, origins=origins, supports_credentials=True)

    @app.route("/ping")
    def ping():
        return jsonify({"status": "ok"}), 200

    app.config["stop_repo"] = StopRepository(supabase_client=supabase)
    app.config["trip_repo"] = TripRepository(supabase_client=supabase)

    app.register_blueprint(stops_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(users_bp)
    return app
