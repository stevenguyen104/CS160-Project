from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/ping")
def ping():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True)