import backend

from flask import Blueprint, jsonify, request

import googlemaps
import os
gmaps: googlemaps.Client = googlemaps.Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))

directions_bp = Blueprint("directions", __name__, url_prefix="/trips/directions")


@directions_bp.route("/", methods=["POST"])
def get_directions():
    data = request.get_json()

    origin = data.get("origin")
    destination = data.get("destination")
    mode = data.get("mode")  # cycling, driving

    directions = gmaps.directions(
        origin,
        destination,
        mode=mode,
        departure_time="now"
    )

    return jsonify(directions)
