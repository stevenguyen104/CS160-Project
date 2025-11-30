import requests

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
    try:
        aqi_responses: list[AQIResponse] = aqi_service.obtain_multiple_aqi()
        combined = zip(place_results, aqi_responses)
        displayed_alerts = [
            {
                "location": place_result.get_name(),
                "AQI_display": aqi_response.get_aqi_display(),
                "color": aqi_response.get_color(),
                "dominant_pollutant": aqi_response.get_dominant_pollutant(),
                "category": aqi_response.get_category()
            }
            for place_result, aqi_response in combined
        ]

        return jsonify({
            "success": True,
            "alerts": displayed_alerts,
            "message": f"{len(place_results)} location{'' if len(place_results) == 1 else 's'} have been loaded."
        }), 200
    except requests.RequestException as e:
        return jsonify({
            "success": False,
            "error": f"Network or HTTP error while obtaining AQI data: {str(e)}"
        }), 502
