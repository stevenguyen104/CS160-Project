from flask import Blueprint, jsonify, request

from ..helpers.directions_response_parser import DirectionsResponse
from ..helpers.place_result_parser import PlaceResult
from ..services.directions_service import DirectionsService

directions_bp = Blueprint("directions", __name__, url_prefix="/trips/directions")


@directions_bp.route("/", methods=["POST"])
def get_directions():
    data = request.get_json()
    places = data.get("places")
    place_results: list[PlaceResult] = [PlaceResult(place) for place in places]
    directions_service: DirectionsService = DirectionsService(place_results)
    directions_response: DirectionsResponse = directions_service.obtain_directions()
    return jsonify(directions_response.get_dict()), 200
