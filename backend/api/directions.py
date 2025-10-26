import backend

from flask import Blueprint, jsonify, request

from googlemaps import Client
import os

gmaps = Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))

directions_bp = Blueprint("directions", __name__, url_prefix="/trips/directions")


@directions_bp.route("/", methods=["POST"])
def get_directions():
    data = request.get_json()

    origin = data.get("origin")
    destination = data.get("destination")
    mode = data.get("mode")  # cycling, driving

    dirs = gmaps.directions(  # type: ignore[attr-defined]
        origin=origin,
        destination=destination,
        mode=mode,
        departure_time="now"
    )

    return jsonify(dirs)
