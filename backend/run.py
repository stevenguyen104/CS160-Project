import os

from backend import create_app

if __name__ == '__main__':
    origins = os.environ.get("FRONTEND_ORIGINS")
    if origins is not None:
        origins = origins.split(",")

    app = create_app(origins)
    app.run(debug=True)
