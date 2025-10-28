from flask import Blueprint, jsonify, request

from supabase import AuthApiError

from ..db.supabase_client import supabase

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        print(response)
        return jsonify({
            "success": True,
            "user_id": response.user.id,
            "message": "User successfully registered"
        }), 201
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@users_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        return jsonify({
            "success": True,
            "user_id": response.user.id,
            "message": "User successfully logged in"
        }), 200

    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@users_bp.route("/logout", methods=["POST"])
def logout_user():
    try:
        response = supabase.auth.sign_out()

        return jsonify({
            "success": True,
            "message": "User successfully signed out"
        }), 200
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@users_bp.route("/", methods=["GET"])
def get_current_user():
    try:
        response = supabase.auth.get_user()

        return jsonify({
            "success": True,
            "user_id": response.user.id,
            "message": "User successfully obtained"
        }), 200
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@users_bp.route("/delete", methods=["DELETE"])
def delete_user():
    user = supabase.auth.get_user()
    user_id = user.id
    response = supabase.auth.admin.delete_user(user_id)

    if response.get("error"):
        return jsonify({
            "success": False,
            "error": response.error.message
        }), 500

    return jsonify({
        "success": True,
        "message": "User account successfully deleted"
    }), 204
