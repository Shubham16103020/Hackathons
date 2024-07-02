from flask import Blueprint, request, jsonify
from services.text_service import predict_service, predict_service_v1

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def handle_predict():
    data = request.json
    category_id = data.get("category_id")
    category_type = data.get("category_type")
    message = data.get("message")

    if not category_id or not category_type:
        return jsonify({"error": "Invalid input data"}), 400

    result = predict_service(category_id, category_type, message)
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

@predict_bp.route('/metadata', methods=['GET'])
def metadata():
    category_id = request.args.get("category_id")
    category_type = request.args.get("category_type")
    command = request.args.get("command", "")

    if not category_id or not category_type:
        return jsonify({"error": "category_id and category_type are required"}), 400

    result = metadata_service(category_id, category_type, command)
    
    return jsonify(result)


@predict_bp.route('/metadata/save', methods=['POST'])
def save_metadata():
    data = request.get_json()

    predicted_message = data.get("predictedMessage")
    command = data.get("command")
    predicted_message_id = data.get("predictedMessageId")
    category_id = data.get("category_id")
    category_type = data.get("category_type")

    result = save_metadata_service(predicted_message, command, predicted_message_id, category_id, category_type)
    
    return jsonify(result)
