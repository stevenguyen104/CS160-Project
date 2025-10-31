from flask import Blueprint, jsonify, request

from ..helpers.place_result_parser import PlaceResult
from ..helpers.aqi_response_parser import AQIResponse
from ..services import AQIService

alerts_bp = Blueprint("alerts", __name__, url_prefix="/stops/alerts")


@alerts_bp.route("/", methods=["POST"])
def get_alerts():
    data = request.get_json()
    places = data.get("places")  # list[google.maps.places.PlaceResult]
    place_results: list[PlaceResult] = [PlaceResult(place) for place in places]
    aqi_service: AQIService = AQIService(place_results)
    aqi_responses: list[AQIResponse] = aqi_service.obtain_multiple_aqi()

    # TODO change how alerts are shown
    num_abnormal_conditions = 0
    bad_aqi_threshold = 100  # TODO make this customizable by the user
    for aqi_response in aqi_responses:
        aqi: int = aqi_response.get_aqi()
        if aqi >= bad_aqi_threshold:
            num_abnormal_conditions += 1

    return jsonify({
        "success": True,
        "message": f"{num_abnormal_conditions} stops have bad AQI.",
        "has_bad_aqi": (num_abnormal_conditions > 0)
    }), 200
