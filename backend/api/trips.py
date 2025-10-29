import uuid

from flask import Blueprint, jsonify, request
from supabase import AuthApiError

from ..db.repositories.trip_repository import TripRepository
from ..db.supabase_client import supabase
from .directions import get_directions_helper
from .emissions import compute_distances, fetch_emission_estimate

trips_bp = Blueprint("trips", __name__, url_prefix="/trips")
trip_repo = TripRepository(supabase_client=supabase)


@trips_bp.route("/", methods=["GET"])
def get_trips():
    try:
        user = supabase.auth.get_user()
        trips = trip_repo.get_trips(user_id=uuid.UUID(user.id))

        return jsonify({
            "success": True,
            "trips": trips,
            "message": "Trips successfully obtained"
        }), 200
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@trips_bp.route("/<int:trip_id>", methods=["GET"])
def get_trip(trip_id: int):
    trip = trip_repo.get_trip(trip_id=trip_id)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully obtained"
    }), 200


@trips_bp.route("/", methods=["POST"])
def create_trip():
    try:
        user = supabase.auth.get_user()
        trip = trip_repo.create_trip(user_id=uuid.UUID(user.id))

        return jsonify({
            "success": True,
            "trip": trip,
            "message": "Trip successfully created"
        }), 201
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id: int):
    # TODO modify this method so it reflects update_trip in trip repository.
    #data = request.get_json()  # Array of PlaceResults
    #places = data.get("places")
    #directions = get_directions_helper(places)
    #_, distances = compute_distances(directions)
    #vehicle_make = data.get("vehicle_make")
    #vehicle_model = data.get("vehicle_model")
    #emissions = fetch_emission_estimate(vehicle_make, vehicle_model, sum(distances) / 1000.0)

    #if emissions.get("status") != 200 or emissions.get("success") is not True:
    #    return jsonify({
    #        "success": False,
    #        "error": "Trip was unable to be updated"
    #    }), 503

    #emissions_data = emissions.get("data")
    #emissions_kg = emissions_data.get("co2e_kg")  # TODO decide if data should always be stored in kg
    #individual_emissions = [emissions_kg * (distance / sum(distances)) for distance in distances]
    #trip = trip_repo.update_trip(trip_id, individual_emissions)
    trip = trip_repo.update_trip(trip_id=trip_id)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully updated"
    }), 204


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id: int):
    # Store deleted trip for UNDO operation later (nice to have feature)
    deleted_trip = trip_repo.delete_trip(trip_id=trip_id)

    return jsonify({
        "success": True,
        "trip": deleted_trip,
        "message": "Trip successfully deleted"
    }), 204
