from flask import Blueprint, jsonify, request

from ..helpers.directions_response_parser import DirectionsResponse
from ..helpers.emissions_estimate_parser import EmissionsEstimate
from ..services.emissions_service import EmissionsService

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    data = request.get_json()
    vehicle_make = data.get("vehicle_make")
    vehicle_model = data.get("vehicle_model")

    if not vehicle_make or not vehicle_model:
        return jsonify({
            "success": False,
            "error": "Please enter your vehicle make and model."
        }), 400

    directions = data.get("directions")
    directions_response: DirectionsResponse = DirectionsResponse(directions)
    total_distance_meters: int = directions_response.get_total_distance()
    distance_value: float = total_distance_meters / 1000.0
    distance_unit: str = "km"
    emissions_service: EmissionsService = EmissionsService(
        vehicle_make=vehicle_make,
        vehicle_model=vehicle_model,
        distance_value=distance_value,
        distance_unit=distance_unit
    )
    emissions_estimate: EmissionsEstimate = emissions_service.obtain_emissions()
    return jsonify(emissions_estimate.get_dict()), 200
