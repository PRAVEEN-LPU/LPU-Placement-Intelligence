"""
Flask API Server for LPU Placement Intelligence & Student Readiness Prediction Platform
Endpoints:
  - GET  /api/health
  - GET  /api/model-info
  - POST /api/predict
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import (
    load_model,
    train_placement_model,
    validate_student_input,
    predict_student_readiness,
    FEATURE_NAMES,
    TARGET_THRESHOLDS,
)

app = Flask(__name__)
# Enable CORS for local development across Vite ports
CORS(app, resources={r"/api/*": {"origins": "*"}})

MODEL_PATH = os.path.join(os.path.dirname(__file__), "placement_model.joblib")
model_payload = None


def get_model():
    """
    Lazy loads or auto-trains the model if not present.
    """
    global model_payload
    if model_payload is None:
        if not os.path.exists(MODEL_PATH):
            app.logger.info("Model file not found. Auto-training demo model...")
            model_payload = train_placement_model(save_path=MODEL_PATH)
        else:
            model_payload = load_model(MODEL_PATH)
    return model_payload


@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify({
        "status": "ok",
        "service": "LPU Placement Intelligence API",
        "model_loaded": model_payload is not None or os.path.exists(MODEL_PATH),
    }), 200


@app.route("/api/model-info", methods=["GET"])
def model_info():
    """
    Returns model training metrics, target thresholds, and feature metadata.
    """
    try:
        payload = get_model()
        return jsonify({
            "status": "success",
            "model_version": payload.get("model_version", "1.0.0"),
            "trained_at": payload.get("trained_at"),
            "features": payload.get("feature_names"),
            "feature_metadata": payload.get("feature_metadata"),
            "target_thresholds": payload.get("target_thresholds"),
            "metrics": payload.get("metrics"),
            "feature_importance": payload.get("feature_importance"),
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Unable to retrieve model info: {str(e)}",
        }), 500


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Receives student profile, validates input, and returns readiness score,
    skill gaps, explainable factors, and personalized improvement plan.
    """
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request content-type must be application/json.",
        }), 400

    data = request.get_json()
    is_valid, validation_result = validate_student_input(data)

    if not is_valid:
        return jsonify({
            "status": "error",
            "message": validation_result,
        }), 400

    sanitized_student = validation_result

    try:
        payload = get_model()
        prediction_result = predict_student_readiness(payload, sanitized_student)
        return jsonify({
            "status": "success",
            "data": prediction_result,
        }), 200
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"An error occurred during prediction: {str(e)}",
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({"status": "error", "message": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"status": "error", "message": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": "error", "message": "Internal server error"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1")
    print(f"Starting LPU Placement Intelligence API on port {port}...")
    # Pre-load or train model
    get_model()
    app.run(host="0.0.0.0", port=port, debug=debug)
