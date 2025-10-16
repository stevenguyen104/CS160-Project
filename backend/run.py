import os

from flask import Flask, jsonify
from flask_cors import CORS

from .api.stops import stops_bp
from .api.trips import trips_bp
from .api.users import users_bp


def create_app(origins: list[str] = None) -> Flask:
    """
    Creates and configures a Flask application with CORS, blueprints, and repositories.

    :param origins: A list of allowed origins for CORS. If None, no restriction is applied.
    :type origins: list[str] or None

    :returns: The configured Flask application instance.
    :rtype: Flask
    """
    app: Flask = Flask(__name__)
    CORS(app, origins=origins, supports_credentials=True)

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
    return app


if __name__ == '__main__':
    frontend_origins: str = os.environ.get("FRONTEND_ORIGINS")
    if frontend_origins is not None:
        frontend_origins: list[str] = frontend_origins.split(",")

    flask_app = create_app(frontend_origins)
    flask_app.run(host="127.0.0.1", port=5000, debug=True)
