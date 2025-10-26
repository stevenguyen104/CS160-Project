import requests
import json
import os

from directions import get_directions_helper
from flask import Blueprint, jsonify, request

import backend

emissions_bp = Blueprint("emissions", __name__, url_prefix="/trips/emissions")


def compute_total_distance(directions_result: json):
    legs = directions_result[0].get("legs")
    total_distance = sum(leg["distance"]["value"] for leg in legs)
    return total_distance


@emissions_bp.route("/", methods=["POST"])
def calculate_emissions():
    url = "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_model"

    headers = {
        "x-rapidapi-key": os.environ.get("RAPIDAPI_KEY"),
        "x-rapidapi-host": "carbonsutra1.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = request.get_json()  # vehicle_make, vehicle_model, google.maps.places.PlaceResult
    place_results = data.get("place_results")
    directions = get_directions_helper(place_results)
    distance_value = compute_total_distance(directions)
    distance_unit = "mi"

    json_data = {
         "vehicle_make": data.get("vehicle_make"),
         "vehicle_model": data.get("vehicle_model"),
         "distance_value": distance_value,
         "distance_unit": distance_unit
    }

    try:
        response = requests.post(url, headers=headers, data=json_data)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
