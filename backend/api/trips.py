import uuid

from flask import Blueprint, jsonify, request

from ..db.repositories.trip_repository import TripRepository
from ..db.supabase_client import supabase
from directions import get_directions_helper
from emissions import compute_distances, fetch_emission_estimate

trips_bp = Blueprint("trips", __name__, url_prefix="/trips")
trip_repo = TripRepository(supabase_client=supabase)


@trips_bp.route("/", methods=["GET"])
def get_trips():
    user = supabase.auth.get_user()

    if user is None:
        return jsonify({
            "success": False,
            "error": "You are not logged in"
        }), 401

    user_id = user.id
    trips = trip_repo.get_trips(uuid.UUID(user_id))

    return jsonify({
        "success": True,
        "trips": trips,
        "message": "Trips successfully obtained"
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["GET"])
def get_trip(trip_id: int):
    trip = trip_repo.get_trip(trip_id)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully obtained"
    }), 200


@trips_bp.route("/", methods=["POST"])
def create_trip():
    user = supabase.auth.get_user()

    if user is None:
        return jsonify({
            "success": False,
            "error": "You are not logged in"
        }), 401

    user_id = user.id
    emissions = []
    trip = trip_repo.create_trip(uuid.UUID(user_id), emissions)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully created"
    }), 201


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id: int):
    data = request.get_json()  # Array of PlaceResults
    places = data.get("places")
    directions = get_directions_helper(places)
    _, distances = compute_distances(directions)
    vehicle_make = data.get("vehicle_make")
    vehicle_model = data.get("vehicle_model")
    emissions = fetch_emission_estimate(vehicle_make, vehicle_model, sum(distances) / 1000.0)

    if emissions.get("status") != 200 or emissions.get("success") is not True:
        return jsonify({
            "success": False,
            "error": "Trip was unable to be updated"
        }), 503

    emissions_data = emissions.get("data")
    emissions_kg = emissions_data.get("co2e_kg")  # TODO decide if data should always be stored in kg
    individual_emissions = [emissions_kg * (distance / distances) for distance in distances]
    trip = trip_repo.update_trip(trip_id, individual_emissions)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully updated"
    }), 204


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id: int):
    # Store deleted trip for UNDO operation later (nice to have feature)
    deleted_trip = trip_repo.delete_trip(trip_id)

    return jsonify({
        "success": True,
        "trip": deleted_trip,
        "message": "Trip successfully deleted"
    }), 204
