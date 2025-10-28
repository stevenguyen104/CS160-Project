import requests

from flask import Blueprint, jsonify, request

import backend
from .placeresult import PlaceResult

alerts_bp = Blueprint("alerts", __name__, url_prefix="/stops/alerts")


def get_alert(data: dict):
    url = "https://airquality.googleapis.com/v1/currentConditions:lookup"

    params = {
        "key": backend.GOOGLE_MAPS_API_KEY
    }

    # data = request.get_json()  # google.maps.places.PlaceResult
    place_result = PlaceResult(data)

    json_data = {
        "location": {
            "latitude": place_result.get_latitude(),
            "longitude": place_result.get_longitude()
        }
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, params=params, json=json_data, headers=headers)
    return response.json()


@alerts_bp.route("/", methods=["POST"])
def get_alerts():
    data = request.get_json()
    places: list[dict] = data.get("places")  # list[google.maps.places.PlaceResult]
    alerts = [get_alert(place) for place in places]

    num_abnormal_conditions = 0
    bad_aqi_threshold = 100  # TODO make this customizable by the user
    for alert in alerts:
        indexes = alert.get("indexes")
        aqi = indexes[0].get("aqi")
        if aqi >= bad_aqi_threshold:
            num_abnormal_conditions += 1

    return jsonify({
        "success": True,
        "message": f"{num_abnormal_conditions} stops have bad AQI.",
        "has_bad_aqi": (num_abnormal_conditions > 0)
    }), 200
