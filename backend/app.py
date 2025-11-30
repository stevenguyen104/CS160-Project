import argparse
import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from .api.alerts import alerts_bp
from .api.directions import directions_bp
from .api.emissions import emissions_bp
from .api.stops import stops_bp
from .api.trips import trips_bp
from .api.users import users_bp


def create_app(origins: list[str] | None = None, supports_credentials: bool = False) -> Flask:
    """
    Creates and configures a Flask application with CORS, blueprints, and repositories.

    :param origins: A list of allowed origins for CORS. If None, no restriction is applied.
    :type origins: list[str] or None
    :param supports_credentials: Whether to support credentials or not.
    :type supports_credentials: bool

    :returns: The configured Flask application instance.
    :rtype: Flask
    """
    app: Flask = Flask(
        __name__,
        static_folder="../frontend/dist",
        static_url_path="/"
    )
    CORS(app, origins=origins, supports_credentials=supports_credentials)

    @app.route("/ping")
    def ping():
        """
        A simple health check endpoint.

        :return: A JSON response with status 'ok' and HTTP 200 OK status code.
        :rtype: flask.Response
        """
        return jsonify({"status": "ok"}), 200

    app.register_blueprint(stops_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(emissions_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(directions_bp)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        """
        Serves the Vite React frontend from dist/.
        If a file exists, return it.
        Otherwise, return index.html for React.
        """
        dist_path = app.static_folder
        assert dist_path is not None, "Flask static_folder should not be None"
        file_path = os.path.join(dist_path, path)

        if path != "" and os.path.exists(file_path):
            return send_from_directory(dist_path, path)
        else:
            return send_from_directory(dist_path, "index.html")

    return app


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run Flask app with additional options.")
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run the Flask app in debug mode"
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        type=str,
        help="Host to run the server on"
    )
    parser.add_argument(
        "--port",
        default=5000,
        type=int,
        help="Port to run the server on"
    )
    parser.add_argument(
        "--origins",
        default="http://localhost:5173",
        type=str,
        help="Comma-separated list of allowed frontend origins"
    )
    args = parser.parse_args()

    origins_list: list[str] | None = args.origins.split(",") if args.origins else None
    flask_app = create_app(origins=origins_list, supports_credentials=True if origins_list else False)
    flask_app.run(host=args.host, port=args.port, debug=args.debug)
