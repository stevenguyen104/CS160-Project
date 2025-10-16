import uuid

from flask import Blueprint, jsonify, request

from ..db.repositories.trip_repository import TripRepository
from ..db.supabase_client import supabase

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

    data = request.get_json()
    # TODO configure how emissions are calculated
    emissions = data.get("emissions")

    trip = trip_repo.create_trip(uuid.UUID(user_id), emissions)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully created"
    }), 201


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id: int):
    data = request.get_json()
    # TODO configure how emissions are calculated
    emissions = data.get("emissions")

    trip = trip_repo.update_trip(trip_id, emissions)

    return jsonify({
        "success": True,
        "trip": trip,
        "message": "Trip successfully updated"
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id: int):
    deleted_trip = trip_repo.delete_trip(trip_id)

    return jsonify({
        "success": True,
        "trip": deleted_trip,
        "message": "Trip successfully deleted"
    }), 200
