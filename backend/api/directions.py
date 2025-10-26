import backend
import json
from placeresult import PlaceResult

from flask import Blueprint, jsonify, request

from googlemaps import Client
import os

gmaps = Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))

directions_bp = Blueprint("directions", __name__, url_prefix="/trips/directions")


def get_directions_helper(array_data: json):
    # array_data = request.get_json()  # list[google.maps.places.PlaceResult]
    place_results = [PlaceResult(data) for data in array_data]

    first_place_result = place_results[0]
    last_place_result = place_results[-1]
    rest_of_place_results = place_results[1:-1]

    origin = (first_place_result.get_latitude(), first_place_result.get_longitude())
    destination = (last_place_result.get_latitude(), last_place_result.get_longitude())
    waypoints = [(result.get_latitude(), result.get_longitude()) for result in rest_of_place_results]
    mode = "driving"  # TODO let users customize; examples are cycling, driving
    departure_time = "now"  # TODO let users customize
    units = "imperial"  # TODO let users customize

    directions = gmaps.directions(  # type: ignore[attr-defined]
        origin=origin,
        destination=destination,
        waypoints=waypoints or [],
        mode=mode,
        departure_time=departure_time,
        units=units
    )

    return directions


@directions_bp.route("/", methods=["POST"])
def get_directions():
    data = request.get_json()
    directions = get_directions_helper(data)
    return jsonify(directions)
