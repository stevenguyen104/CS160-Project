from flask import Flask, jsonify, request
from flask_cors import CORS
from db.supabase_client import supabase
from db.repositories.trip_repository import TripRepository
from db.repositories.stop_repository import StopRepository

app = Flask(__name__)
CORS(app, supports_credentials=True)

trip_repo = TripRepository(supabase_client=supabase)
stop_repo = StopRepository(supabase_client=supabase)

# -----------------------------
# USER ROUTES
# -----------------------------
@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    # username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    res = supabase.auth.sign_up({"email": email, "password": password})

    if res.user is None:
        return jsonify({"error": res.error.message}), 400

    return jsonify({"user_id": res.user.id, "email": res.user.email})

@app.route("/users/login", methods=["POST"])
def login_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    res = supabase.auth.sign_in({"email": username, "password": password})

    if res.user is None:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"access_token": res.session.access_token, "user_id": res.user.id})

@app.route("/users/about", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing access token"}), 401

    token = auth_header.split("Bearer ")[-1]
    res = supabase.auth.get_user(token)
    if res.user is None:
        return jsonify({"error": "Invalid access token"}), 401

    return jsonify({"user_id": res.user.id, "email": res.user.email, "created_at": res.user.created_at})

# -----------------------------
# TRIP ROUTES
# -----------------------------
@app.route("/trips", methods=["POST"])
def create_trip():
    data = request.json
    user_id = data.get("user_id")
    emissions = data.get("emissions", 0.0)

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    trip = trip_repo.create_trip(user_id, emissions)
    return jsonify(trip), 201


@app.route("/trips/<int:user_id>", methods=["GET"])
def get_trips_for_user(user_id):
    trips = trip_repo.get_trips_for_user(user_id)
    return jsonify(trips), 200


@app.route("/trip/<int:trip_id>", methods=["GET"])
def get_trip(trip_id):
    trip = trip_repo.get_trip_by_id(trip_id)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    return jsonify(trip), 200


@app.route("/trip/<int:trip_id>/emissions", methods=["PUT"])
def update_trip_emissions(trip_id):
    data = request.json
    emissions = data.get("emissions")

    if emissions is None:
        return jsonify({"error": "Emissions value required"}), 400

    updated = trip_repo.update_trip_emissions(trip_id, emissions)
    if not updated:
        return jsonify({"error": "Trip not found"}), 404

    return jsonify({"message": "Trip emissions updated"}), 200


# -----------------------------
# STOP ROUTES
# -----------------------------
@app.route("/stops", methods=["POST"])
def add_stop():
    data = request.json
    trip_id = data.get("trip_id")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    name = data.get("name")
    position = data.get("position")

    if not all([trip_id, latitude, longitude, name, position is not None]):
        return jsonify({"error": "Missing required fields"}), 400

    stop = stop_repo.add_stop(trip_id, latitude, longitude, name, position)
    return jsonify(stop), 201


@app.route("/stops/<int:trip_id>", methods=["GET"])
def get_stops_for_trip(trip_id):
    stops = stop_repo.get_stops_for_trip(trip_id)
    return jsonify(stops), 200


@app.route("/stop/<int:stop_id>", methods=["DELETE"])
def delete_stop(stop_id):
    success = stop_repo.delete_stop(stop_id)
    if not success:
        return jsonify({"error": "Stop not found"}), 404
    return jsonify({"message": "Stop deleted"}), 200


@app.route("/stop/<int:stop_id>/position", methods=["PUT"])
def update_stop_position(stop_id):
    data = request.json
    new_position = data.get("new_position")

    if new_position is None:
        return jsonify({"error": "New position is required"}), 400

    success = None # stop_repo.update_stop_position(stop_id, new_position)
    if not success:
        return jsonify({"error": "Stop not found"}), 404

    return jsonify({"message": "Stop position updated"}), 200

@app.route("/ping")
def ping():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True)
