from flask import Blueprint, jsonify, request, current_app

stops_bp = Blueprint("stops", __name__, url_prefix="/trips/<int:trip_id>/stops")


@stops_bp.route("/", methods=["GET"])
def get_stops(trip_id: int):
    stop_repo = current_app.config["stop_repo"]

    stops = stop_repo.get_stops(trip_id)

    return jsonify({
        "success": True,
        "stops": stops
    }), 200


@stops_bp.route("/<int:stop_id>", methods=["GET"])
def get_trip(trip_id: int, stop_id: int):
    stop_repo = current_app.config["stop_repo"]

    stop = stop_repo.get_stop(trip_id, stop_id)

    return jsonify({
        "success": True,
        "stop": stop
    }), 200


@stops_bp.route("/", methods=["POST"])
def add_stop(trip_id: int):
    stop_repo = current_app.config["stop_repo"]

    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    name = data.get("name")
    stop_order = data.get("stop_order")

    stop = stop_repo.add_stop(trip_id, latitude, longitude, name, stop_order)

    return jsonify({
        "success": True,
        "stop": stop
    }), 201


@stops_bp.route("/<int:stop_id>", methods=["PUT"])
def reorder_stop(trip_id: int, stop_id: int):
    stop_repo = current_app.config["stop_repo"]

    data = request.get_json()
    new_order = data.get("stop_order")
    stop = stop_repo.reorder_stop(trip_id, stop_id, new_order)

    return jsonify({
        "success": True,
        "stop": stop
    }), 200


@stops_bp.route("/<int:stop_id>", methods=["DELETE"])
def remove_stop(trip_id: int, stop_id: int):
    stop_repo = current_app.config["stop_repo"]

    deleted_stop = stop_repo.delete_stop(trip_id, stop_id)
    return jsonify({
        "success": deleted_stop,
        "message": "Stop successfully deleted" if deleted_stop else "Stop was not deleted"
    }), 200 if deleted_stop else 404
