from flask import Blueprint, jsonify, request, current_app
from googlemaps import Client

import backend
from .placeresult import PlaceResult

# gmaps: Client = Client(key=backend.GOOGLE_MAPS_API_KEY)

directions_bp = Blueprint("directions", __name__, url_prefix="/trips/directions")


def get_directions_helper(array_data: list[dict[str, object]]) -> dict:
    """
    Given a list of PlaceResults, compute directions using Google Maps Directions API.

    :param array_data: A list of PlaceResults.
    :return: A Directions object.
    """
    # array_data = request.get_json()  # list[google.maps.places.PlaceResult]
    place_results: list[PlaceResult] = [PlaceResult(data) for data in array_data]
    if len(place_results) < 2:
        raise ValueError("At least an origin and destination are required to get directions.")

    first_place_result = place_results[0]
    last_place_result = place_results[-1]
    rest_of_place_results = place_results[1:-1]

    origin: tuple = (first_place_result.get_latitude(), first_place_result.get_longitude())
    destination: tuple = (last_place_result.get_latitude(), last_place_result.get_longitude())
    waypoints: list[tuple] = [(result.get_latitude(), result.get_longitude()) for result in rest_of_place_results]
    mode = "driving"  # TODO let users customize; examples are cycling, driving
    departure_time = "now"  # TODO let users customize
    units = "imperial"  # TODO let users customize

    directions = current_app.config.get("gmaps").directions(  # type: ignore[attr-defined]
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
    places = data.get("places")
    directions = get_directions_helper(places)
    return jsonify(directions)
