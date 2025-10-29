import requests

from flask import Blueprint, jsonify, request

from backend import RAPIDAPI_KEY
from directions import get_directions_helper

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")

CARBON_API_URL = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"


def compute_distances(directions_route: dict) -> (list[str], list[int]):
    """
    Compute the individual distances from a directions result.

    :param directions_route: A Directions object's route.
    :return: A list of distances displayed to the user and in meters from the route.
    """
    legs = directions_route.get("legs", [])
    readable_distances = []
    distances = []

    for leg in legs:
        try:
            distance = leg["distance"]
            readable_distances.append(distance["text"])
            distances.append(distance["value"])  # always in meters
        except (TypeError, KeyError):
            raise ValueError(f"Missing distance in leg: {leg}")

    return readable_distances, distances


def fetch_emission_estimate(make: str, model: str, distance: float, unit: str = "km") -> dict:
    """
    Send emission request to CarbonSutra API.
    """
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = {
        "vehicle_make": make,
        "vehicle_model": model,
        "distance_value": distance,
        "distance_unit": unit
    }

    response = requests.post(CARBON_API_URL, headers=headers, data=payload)
    response.raise_for_status()
    return response.json()


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    """
    Calculates emissions based on vehicle models and distance.
    """

    data = request.get_json()  # vehicle_make, vehicle_model, google.maps.places.PlaceResult
    vehicle_make = data.get("vehicle_make")
    vehicle_model = data.get("vehicle_model")
    place_results = data.get("place_results")

    directions = get_directions_helper(place_results)
    distances = compute_distances(directions)
    distance_value = sum(distances) / 1000.0  # meters to kilometers
    distance_unit = "km"

    try:
        response = fetch_emission_estimate(vehicle_make, vehicle_model, distance_value, distance_unit)
        return jsonify(response), 200
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
