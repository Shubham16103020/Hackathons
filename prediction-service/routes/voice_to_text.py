from flask import Blueprint, request, jsonify
import os
from services.audio_service import audio_to_text_v1

voice_to_text_bp = Blueprint('voice_to_text', __name__)

@voice_to_text_bp.route('/voice-to-text', methods=['POST'])
def voice_to_text_route():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file:
            audio_file_path = "uploaded_audio.wav"
            file.save(audio_file_path)
            transcription = audio_to_text_v1(audio_file_path)
            os.remove(audio_file_path)
            return jsonify({"transcription": transcription})
    except Exception as e:
        return jsonify({"error": "Failed to process audio file"}), 500
