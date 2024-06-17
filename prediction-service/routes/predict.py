from flask import Blueprint, request, jsonify
from services.text_service import predict_service, predict_service_v1

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def handle_predict():
    data = request.form
    user_input = data.get("input")
    question_id = data.get("question_id")
    target_language = data.get("target_language", "en")

    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        user_input = predict_service(file, question_id, target_language)

    if not user_input or not question_id:
        return jsonify({"error": "Invalid input data"}), 400

    result = predict_service(user_input, question_id)
    return jsonify(result)

predict_v1 = Blueprint('predict_v1', __name__)

@predict_bp.route('/v1/predict', methods=['POST'])
def handle_predict_v1():
    data = request.form
    user_input = data.get("input")
    question_id = data.get("question_id")
    target_language = data.get("target_language", "en")

    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file:
            result = predict_service_v1(file, question_id)
            return jsonify(result)

    if not user_input or not question_id:
        return jsonify({"error": "Invalid input data"}), 400

    result = predict_service_v1(user_input, question_id)
    return jsonify(result)
