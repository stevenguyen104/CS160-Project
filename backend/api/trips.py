import uuid

from flask import Blueprint, jsonify, request, current_app
from backend.db.supabase_client import supabase

trips_bp = Blueprint("trips", __name__, url_prefix="/trips")


@trips_bp.route("/", methods=["GET"])
def get_trips():
    trip_repo = current_app.config["trip_repo"]
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
        "trips": trips
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["GET"])
def get_trip(trip_id: int):
    trip_repo = current_app.config["trip_repo"]
    trip = trip_repo.get_trip(trip_id)

    return jsonify({
        "success": True,
        "trip": trip
    }), 200


@trips_bp.route("/", methods=["POST"])
def create_trip():
    trip_repo = current_app.config["trip_repo"]
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
        "trip": trip
    }), 201


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id: int):
    trip_repo = current_app.config["trip_repo"]

    data = request.get_json()
    # TODO configure how emissions are calculated
    emissions = data.get("emissions")

    trip = trip_repo.update_trip(trip_id, emissions)
    return jsonify({
        "success": True,
        "trip": trip
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id: int):
    trip_repo = current_app.config["trip_repo"]

    deleted_trip = trip_repo.delete_trip(trip_id)
    return jsonify({
        "success": deleted_trip,
        "message": "Trip successfully deleted" if deleted_trip else "Trip was not deleted"
    }), 200 if deleted_trip else 404
