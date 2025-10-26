import requests
import os

from flask import Blueprint, jsonify, request

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"

    headers = {
        "x-rapidapi-key": os.environ.get("RAPIDAPI_KEY"),
        "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # TODO test data
    data = request.get_json()
    # data = {
    #    "vehicle_make": "Honda",
    #    "vehicle_model": "Accord",
    #    "distance": 4,
    #    "distance_unit": "mi"
    # }

    try:
        response = requests.post(url, headers=headers, data=data)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
