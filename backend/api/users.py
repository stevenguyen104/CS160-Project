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

        user = response.user
        if user is None:
            return jsonify({
                "success": False,
                "error": "User unable to sign up"
            }), 400
        
        return jsonify({
            "success": True,
            "user_id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "last_sign_in_at": user.last_sign_in_at,
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

        user = response.user
        if user is None:
            return jsonify({
                "success": False,
                "error": "User unable to sign in"
            }), 400
        
        return jsonify({
            "success": True,
            "user_id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "last_sign_in_at": user.last_sign_in_at,
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
        supabase.auth.sign_out()

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
        if response is None:
            return jsonify({
                "success": False,
                "error": "Cannot get current user"
            }), 401

        user = response.user
        return jsonify({
            "success": True,
            "user_id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "last_sign_in_at": user.last_sign_in_at,
            "message": "User successfully obtained"
        }), 200
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status


@users_bp.route("/", methods=["DELETE"])
def delete_user():
    try:
        response = supabase.auth.get_user()
        if response is None:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 401

        supabase.auth.admin.delete_user(response.user.id)

        return jsonify({
            "success": True,
            "message": "User account successfully deleted"
        }), 204
    except AuthApiError as err:
        return jsonify({
            "success": False,
            "error": f"{err.name}: {err.code}"
        }), err.status
