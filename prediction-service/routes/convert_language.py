from flask import Blueprint, request, jsonify
from services.language_service import convert_language

convert_language_bp = Blueprint('convert_language', __name__)

@convert_language_bp.route('/convert-language', methods=['POST'])
def convert_language_route():
    data = request.get_json(force=True)
    text = data.get("text")
    target_language = data.get("target_language", "en")
    source_language = data.get("source_language", "en")

    if not text:
        return jsonify({"error": "Invalid input data"}), 400

    converted_text = convert_language(text, source_language, target_language)
    return jsonify({"input": text, "target_language": target_language, "converted_text": converted_text})
