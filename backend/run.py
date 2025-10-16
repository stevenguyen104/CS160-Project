import os

from backend import create_app

if __name__ == '__main__':
    origins: str = os.environ.get("FRONTEND_ORIGINS")
    if origins is not None:
        origins: list[str] = origins.split(",")

    app = create_app(origins)
    app.run(host="127.0.0.1", port=5000, debug=True)
