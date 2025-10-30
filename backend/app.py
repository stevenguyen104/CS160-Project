import googlemaps
from flask import Flask, jsonify
from flask_cors import CORS

from .api.alerts import alerts_bp
from .api.directions import directions_bp
from .api.emissions import emissions_bp
from .api.stops import stops_bp
from .api.trips import trips_bp
from .api.users import users_bp
import backend


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
    app: Flask = Flask(__name__)
    CORS(app, origins=origins, supports_credentials=supports_credentials)

    @app.route("/ping")
    def ping():
        """
        A simple health check endpoint.

        :return: A JSON response with status 'ok' and HTTP 200 OK status code.
        :rtype: flask.Response
        """
        return jsonify({"status": "ok"}), 200

    app.config["gmaps"] = googlemaps.Client(key=backend.GOOGLE_MAPS_API_KEY)
    app.register_blueprint(stops_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(emissions_bp)
    app.register_blueprint(alerts_bp)
    app.register_blueprint(directions_bp)
    return app


if __name__ == '__main__':
    origins: str | None = backend.FRONTEND_ORIGINS
    if origins is not None:
        flask_app = create_app(origins=origins.split(","), supports_credentials=True)
    else:
        flask_app = create_app(supports_credentials=True)
    flask_app.run(debug=True)
