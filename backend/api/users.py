from flask import Blueprint, jsonify, request

from ..db.supabase_client import supabase

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })

    if response.get("error"):
        return jsonify({
            "success": False,
            "error": response.error.message
        }), 400

    return jsonify({
        "success": True,
        "user": response.user,
        "message": "User successfully registered"
    }), 201


@users_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    if response.get("error"):
        return jsonify({
            "success": False,
            "error": response.error.message
        }), 401

    return jsonify({
        "success": True,
        "user": response.user,
        "message": "User successfully logged in"
    }), 200


@users_bp.route("/logout", methods=["POST"])
def logout_user():
    response = supabase.auth.sign_out()

    if response.get("error"):
        return jsonify({
            "success": False,
            "error": response.error.message
        }), 500

    return jsonify({
        "success": True,
        "message": "User successfully logged out"
    }), 200


@users_bp.route("/profile", methods=["GET"])
def get_current_user():
    response = supabase.auth.get_user()

    if response.get("error"):
        return jsonify({
            "success": False,
            "error": response.error.message
        }), 401

    return jsonify({
        "success": True,
        "user": response.user,
        "message": "User successfully obtained"
    }), 200


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
