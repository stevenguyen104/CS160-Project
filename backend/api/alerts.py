from flask import Blueprint, jsonify, request

from ..helpers.place_result_parser import PlaceResult
from ..helpers.aqi_response_parser import AQIResponse
from ..services.aqi_service import AQIService

alerts_bp = Blueprint("alerts", __name__, url_prefix="/stops/alerts")


@alerts_bp.route("/", methods=["POST"])
def get_alerts():
    data = request.get_json()
    places = data.get("places")
    place_results: list[PlaceResult] = [PlaceResult(place) for place in places]
    aqi_service: AQIService = AQIService(place_results)
    aqi_responses: list[AQIResponse] = aqi_service.obtain_multiple_aqi()
    combined = zip(place_results, aqi_responses)
    filtered_alerts = filter(lambda x: x[1].get_aqi() >= 50, combined)  # TODO adjust or customize threshold if needed
    displayed_alerts = [
        {
            "location": place_result.get_name(),
            "AQI_display": aqi_response.get_aqi_display()
        } 
        for place_result, aqi_response in filtered_alerts
    ]

    return jsonify({
        "success": True,
        "alerts": displayed_alerts,
        "message": f"{len(displayed_alerts)} location{'' if len(displayed_alerts) == 1 else 's'}"
                   f" have a moderate AQI or worse."
    }), 200
