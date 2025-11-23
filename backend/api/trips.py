from uuid import UUID

from flask import Blueprint, jsonify, request
from postgrest.exceptions import APIError
from supabase import AuthApiError

from ..db.repositories.trip_repository import TripRepository
from ..db.supabase_client import supabase
from ..helpers.postgresql_error_code import PostgreSQLErrorCode

trips_bp = Blueprint("trips", __name__, url_prefix="/trips")
trip_repo = TripRepository(supabase_client=supabase)


@trips_bp.route("/", methods=["GET"])
def get_trips():
    try:
        response = supabase.auth.get_user()
        if response is None:
            return jsonify({
                "success": False,
                "error": "Cannot get current user"
            }), 401
        
        trips = trip_repo.get_trips(user_id=UUID(response.user.id))

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
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@trips_bp.route("/<int:trip_id>", methods=["GET"])
def get_trip(trip_id: int):
    try:
        trip = trip_repo.get_trip(trip_id=trip_id)

        return jsonify({
            "success": True,
            "trip": trip,
            "message": "Trip successfully obtained"
        }), 200
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@trips_bp.route("/", methods=["POST"])
def create_trip():
    try:
        response = supabase.auth.get_user()
        if response is None:
            return jsonify({
                "success": False,
                "error": "Cannot get current user"
            }), 401

        data = request.get_json()
        name = data.get("name", "Untitled Trip")
        trip = trip_repo.create_trip(user_id=UUID(response.user.id), name=name)

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
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id: int):
    data = request.get_json()
    new_name = data.get("name", "Untitled Trip")
    try:
        trip = trip_repo.update_trip(trip_id=trip_id, new_name=new_name)

        return jsonify({
            "success": True,
            "trip": trip,
            "message": "Trip successfully updated"
        }), 204
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id: int):
    # Store deleted trip for UNDO operation later (nice to have feature)
    try:
        deleted_trip = trip_repo.delete_trip(trip_id=trip_id)

        return jsonify({
            "success": True,
            "trip": deleted_trip,
            "message": "Trip successfully deleted"
        }), 204
    except APIError as err:
        code = PostgreSQLErrorCode(err.code)
        return jsonify({
            "success": False,
            "error": f"Error {err.code}: {err.message}"
        }), code.to_http_status()
