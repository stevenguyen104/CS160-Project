import requests
import json
import os

import backend
from parse_placeresult import ParsePlaceResult

from flask import Blueprint, jsonify, request

alerts_bp = Blueprint("alerts", __name__, url_prefix="/stops/alerts")


def get_alert(data: json):
    url = "https://airquality.googleapis.com/v1/currentConditions:lookup"

    params = {
        "key": os.environ.get("GOOGLE_MAPS_API_KEY")
    }

    # data = request.get_json()  # google.maps.places.PlaceResult
    place_result = ParsePlaceResult(data)

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
    array_data: list[dict] = request.get_json()  # list[google.maps.places.PlaceResult]
    alerts = [get_alert(data) for data in array_data]

    num_abnormal_conditions = 0
    bad_aqi_threshold = 100
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
