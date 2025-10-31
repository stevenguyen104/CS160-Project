from flask import Blueprint, jsonify, request, current_app
from googlemaps import Client

from ..helpers.directions_response_parser import DirectionsResponse
from ..helpers.emissions_estimate_parser import EmissionsEstimate
from ..helpers.place_result_parser import PlaceResult
from ..services.directions_service import DirectionsService
from ..services.emissions_service import EmissionsService

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    data = request.get_json()
    vehicle_make = data.get("vehicle_make")
    vehicle_model = data.get("vehicle_model")
    places = data.get("place_results")
    place_results: list[PlaceResult] = [PlaceResult(place) for place in places]
    # TODO store directions so we don't have to call the Directions API again.
    gmaps_client: Client = current_app.config.get("gmaps")
    directions_service: DirectionsService = DirectionsService(place_results, gmaps_client)
    directions_response: DirectionsResponse = directions_service.obtain_directions()
    total_distance_meters: int = sum(directions_response.get_distances())
    distance_value: float = total_distance_meters / 1000.0
    distance_unit: str = "km"
    emissions_service: EmissionsService = EmissionsService(
        vehicle_make=vehicle_make,
        vehicle_model=vehicle_model,
        distance_value=distance_value,
        distance_unit=distance_unit
    )
    emissions_estimate: EmissionsEstimate = emissions_service.obtain_emissions()
    return jsonify(emissions_estimate)
