from flask import Blueprint, jsonify, request

from ..db.repositories.stop_repository import StopRepository
from ..db.supabase_client import supabase

stops_bp = Blueprint("stops", __name__, url_prefix="/trips/<int:trip_id>/stops")
stop_repo = StopRepository(supabase_client=supabase)


@stops_bp.route("/", methods=["GET"])
def get_stops(trip_id: int):
    stops = stop_repo.get_stops(trip_id)

    return jsonify({
        "success": True,
        "stops": stops,
        "message": "Stops successfully obtained"
    }), 200


@stops_bp.route("/<int:stop_id>", methods=["GET"])
def get_stop(trip_id: int, stop_id: int):
    stop = stop_repo.get_stop(trip_id, stop_id)

    return jsonify({
        "success": True,
        "stop": stop,
        "message": "Stop successfully obtained"
    }), 200


@stops_bp.route("/", methods=["POST"])
def add_stop(trip_id: int):
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    name = data.get("name")
    stop_order = data.get("stop_order")

    stop = stop_repo.add_stop(trip_id, latitude, longitude, name, stop_order)

    return jsonify({
        "success": True,
        "stop": stop,
        "message": "Stop was successfully added to the trip"
    }), 201


@stops_bp.route("/<int:stop_id>", methods=["PUT"])
def reorder_stop(trip_id: int, stop_id: int):
    data = request.get_json()
    new_order = data.get("stop_order")
    stop = stop_repo.reorder_stop(trip_id, stop_id, new_order)

    return jsonify({
        "success": True,
        "stop": stop,
        "message": "Stop successfully reordered"
    }), 200


@stops_bp.route("/<int:stop_id>", methods=["DELETE"])
def remove_stop(trip_id: int, stop_id: int):
    deleted_stop = stop_repo.delete_stop(trip_id, stop_id)

    return jsonify({
        "success": True,
        "stop": deleted_stop,
        "message": "Stop successfully deleted"
    }), 200
