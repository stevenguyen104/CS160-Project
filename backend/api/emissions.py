import requests

from flask import Blueprint, jsonify, request

from backend import RAPIDAPI_KEY
from directions import get_directions_helper

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


def compute_distances(directions_route: dict) -> list[int]:
    """
    Compute the individual distances from a directions result.

    :param directions_route: A Directions object's route.
    :return: A list of distances (in meters) from the route.
    """
    legs = directions_route.get("legs")
    distances = [leg.get("distance").get("value") for leg in legs]  # meters
    return distances


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = request.get_json()  # vehicle_make, vehicle_model, google.maps.places.PlaceResult
    place_results = data.get("place_results")
    directions = get_directions_helper(place_results)
    distances = compute_distances(directions)
    distance_value = sum(distances) / 1000  # meters to kilometers
    distance_unit = "km"

    json_data = {
         "vehicle_make": data.get("vehicle_make"),
         "vehicle_model": data.get("vehicle_model"),
         "distance_value": distance_value,
         "distance_unit": distance_unit
    }

    try:
        response = requests.post(url, headers=headers, data=json_data)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
