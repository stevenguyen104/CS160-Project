from flask import Blueprint, jsonify, request
from postgrest.exceptions import APIError

from ..db.repositories.stop_repository import StopRepository
from ..db.supabase_client import supabase
from ..helpers.place_result_parser import PlaceResult
from ..helpers.postgresql_error_code import PostgreSQLErrorCode
from ..services.places_service import PlacesService

stops_bp = Blueprint("stops", __name__, url_prefix="/trips/<int:trip_id>/stops")
stop_repo = StopRepository(supabase_client=supabase)


@stops_bp.route("/", methods=["GET"])
def get_stops(trip_id: int):
    try:
        stops = stop_repo.get_stops(trip_id=trip_id)
        formatted_stops: list[str] = [stop["place_id"] for stop in stops]  # type: ignore[attr-defined]
        places_services: PlacesService = PlacesService(formatted_stops)
        place_results: list[PlaceResult] = places_services.obtain_place_details()
        formatted_places: list[dict] = [place_result.get_place() for place_result in place_results]

        return jsonify({
            "success": True,
            "stops": formatted_places,
            "message": "Stops successfully obtained"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/<int:stop_id>", methods=["GET"])
def get_stop(trip_id: int, stop_id: int):
    try:
        stop = stop_repo.get_stop(trip_id=trip_id, stop_id=stop_id)
        places_service: PlacesService = PlacesService([stop["place_id"]])  # type: ignore[attr-defined]
        place_result: PlaceResult = places_service.obtain_place_details()[0]
        formatted_place: dict = place_result.get_place()

        return jsonify({
            "success": True,
            "stop": formatted_place,
            "message": "Stop successfully obtained"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/", methods=["POST"])
def add_stop(trip_id: int):
    data = request.get_json()
    place = PlaceResult(data.get("place"))
    stop_order = data.get("stop_order")  # TODO get the ordering from frontend

    try:
        stop = stop_repo.add_stop(trip_id=trip_id, stop=place, stop_order=stop_order)

        return jsonify({
            "success": True,
            "stop": stop,
            "message": "Stop was successfully added to the trip."
        }), 201
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/add", methods=["POST"])
def add_stops(trip_id: int):
    data = request.get_json()
    places = data.get("places") or []
    if not places:
        return jsonify({
            "success": False,
            "message": "No stops were added!"
        }), 400
    
    place_results: list[PlaceResult] = [PlaceResult(place) for place in places]

    try:
        stops = stop_repo.add_stops(trip_id=trip_id, stops=place_results)

        return jsonify({
            "success": True,
            "stops": stops,
            "message": "Stops were successfully added to the trip."
        }), 201
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/<int:stop_id>", methods=["PUT"])
def reorder_stop(trip_id: int, stop_id: int):
    data = request.get_json()
    new_order = data.get("stop_order")  # TODO optimize reordering so only modified stops will have to be called
    try:
        stop = stop_repo.reorder_stop(trip_id=trip_id, stop_id=stop_id, new_order=new_order)

        return jsonify({
            "success": True,
            "stop": stop,
            "message": "Stop successfully reordered"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/<int:stop_id>", methods=["DELETE"])
def remove_stop(trip_id: int, stop_id: int):
    try:
        deleted_stop = stop_repo.delete_stop(trip_id=trip_id, stop_id=stop_id)

        return jsonify({
            "success": True,
            "stop": deleted_stop,
            "message": "Stop successfully deleted"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@stops_bp.route("/", methods=["DELETE"])
def remove_stops(trip_id: int):
    try:
        deleted_stops = stop_repo.delete_stops(trip_id=trip_id)

        return jsonify({
            "success": True,
            "stops": deleted_stops,
            "message": "Stops successfully deleted"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()
