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
    # data = {
    #    "vehicle_make": "Honda",
    #    "vehicle_model": "Accord",
    #    "distance": 4,
    #    "distance_unit": "mi"
    # }

    data = request.get_json()

    vehicle_make = data.get("vehicle_make")
    vehicle_model = data.get("vehicle_model")
    distance_unit = data.get("distance_unit", "km")
    stops = data.get("stops", [])

    stop_distances = []
    for stop in stops:
        stop_distances.append(stop.get("distanceMeters", 0) / 1000)
    distance_value = sum(stop_distances)

    payload = f"vehicle_make={vehicle_make}&vehicle_model={vehicle_model}&distance_value={distance_value}&distance_unit={distance_unit}"

    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        result_json = response.json()
        total_emissions = result_json.get("data", {}).get("co2e_kg")
        if total_emissions is None:
            return jsonify({
                "success": False,
                "error": "Missing emissions data",
                "raw_response": result_json
            }), 502
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "error": f"Failed to connect to CarbonSutra: {e}"
        }), 500

    # Distributing total emissions proportionally to each stop, not cumulatively
    stop_emissions = [total_emissions * (distance / distance_value) for distance in stop_distances]
    stop_emissions.append(total_emissions)

    return jsonify({
        "success": True,
        "stop_emissions": stop_emissions
    }), 200
