import requests
import os

from flask import Blueprint, jsonify, request

import backend

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"

    headers = {
        "x-rapidapi-key": os.environ.get("RAPIDAPI_KEY"),
        "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = request.get_json()

    json_data = {
         "vehicle_make": data.get("vehicle_make"),
         "vehicle_model": data.get("vehicle_model"),
         "distance_value": data.get("distance_value"),
         "distance_unit": data.get("distance_unit")
    }

    try:
        response = requests.post(url, headers=headers, data=json_data)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
