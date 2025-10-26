import requests
import os

import backend

from flask import Blueprint, jsonify, request

alerts_bp = Blueprint("alerts", __name__, url_prefix="/trips/alerts")


@alerts_bp.route("/", methods=["POST"])
def get_alerts():
    url = "https://airquality.googleapis.com/v1/currentConditions:lookup"

    params = {
        "key": os.environ.get("GOOGLE_MAPS_API_KEY")
    }

    data = request.get_json()

    json_data = {
        "location": {
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude")
        }
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, params=params, json=json_data, headers=headers)
    return jsonify(response.json())
