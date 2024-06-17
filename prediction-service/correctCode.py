# from flask import Flask, request, jsonify
# from transformers import MarianMTModel, MarianTokenizer, AutoModelForSequenceClassification, AutoTokenizer,  M2M100ForConditionalGeneration, M2M100Tokenizer, Wav2Vec2ForCTC, Wav2Vec2Processor
# from fuzzywuzzy import process
# from fuzzywuzzy import process
# import torch
# import re
# import soundfile as sf
# import requests
# from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
# from langdetect import detect
# import os
# import librosa

# app = Flask(__name__)

# # Define supported language codes and corresponding model names
# supported_languages = {
#     "hindi": "Helsinki-NLP/opus-mt-en-hi",
#     "spanish": "Helsinki-NLP/opus-mt-en-es",
#     "english" :"Helsinki-NLP/opus-mt-en-en",
#     "general": "facebook/m2m100_418M"
#     # Add more supported languages and corresponding model names as needed
# }

# # Load your multilingual classification model and tokenizer
# classification_model_name = "bert-base-multilingual-cased"  # Use a valid multilingual model identifier
# classification_model = AutoModelForSequenceClassification.from_pretrained(classification_model_name)
# classification_tokenizer = AutoTokenizer.from_pretrained(classification_model_name)

# # Function to preprocess options for fuzzy matching
# def preprocess_options(options):
#     processed_options = []
#     for option in options:
#         # Remove leading numbers and dots
#         processed_option = re.sub(r'^\d+\.\s*', '', option)
#         processed_options.append(processed_option)
#     return processed_options

# # Common method for language conversion
# def convert_language(input_text,src_lang, target_lang):
#     model_name = supported_languages.get("general")
#     tokenizer = M2M100Tokenizer.from_pretrained(model_name)
#     model = M2M100ForConditionalGeneration.from_pretrained(model_name)

#     # Tokenize the input text
#     tokenizer.src_lang = src_lang
#     encoded_input = tokenizer(input_text, return_tensors="pt")

#     # Generate translation
#     generated_tokens = model.generate(**encoded_input, forced_bos_token_id=tokenizer.get_lang_id(target_lang))
#     translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
#     return translated_text

# # Function to load audio file
# def load_audio(file_path):
#     speech, sample_rate = sf.read(file_path)
#     return speech, sample_rate

# @app.route('/convert-language', methods=['POST'])
# def convert_language_route():
#     data = request.get_json(force=True)
#     text = data.get("text")
#     target_language = data.get("target_language", "en")
#     source_language = data.get("source_language", "en")

#     if not text:
#         return jsonify({"error": "Invalid input data"}), 400

#     converted_text = convert_language(text,source_language, target_language)
#     return jsonify({"input": text, "target_language": target_language, "converted_text": converted_text})

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json(force=True)
#     user_input = data.get("input")
#     question_id = data.get("question_id")
#     target_language = data.get("target_language", "en")  # Default value is "en"
#     #user_input = convert_language(user_input, target_language)

#     if not user_input or not question_id:
#         return jsonify({"error": "Invalid input data"}), 400


#     # Fetch question options from the question server
#     BASE_URL = 'http://localhost:3000'  # Update this with your actual base URL
#     response = requests.get(f'{BASE_URL}/questions/{question_id}/answers')
#     if response.status_code != 200:
#         return jsonify({"error": "Failed to fetch question options"}), response.status_code

#     question_options = response.json()
#     options = [q['value'] for q in question_options]

#     # Preprocess options for fuzzy matching
#     processed_options = preprocess_options(options)

#     # Perform fuzzy matching to find the closest match from processed options
#     corrected_input, score = process.extractOne(user_input, processed_options)

#     # Check if the score is below a certain threshold (e.g., 70)
#     if score < 30:
#         return jsonify({"error": "Please select correct option"}), 400

#     # Tokenize the corrected input
#     inputs = classification_tokenizer(corrected_input, return_tensors="pt")
    
#     # Get predictions
#     with torch.no_grad():
#         outputs = classification_model(**inputs)
#         logits = outputs.logits
#         predicted_class_id = logits.argmax().item()
    
#     #corrected_input = convert_language(corrected_input, target_language)

#     return jsonify({"input": corrected_input, "prediction": predicted_class_id})

# # Function to load and resample audio file
# def load_and_resample_audio(file_path, target_sample_rate):
#     speech, sample_rate = sf.read(file_path)
#     if sample_rate != target_sample_rate:
#         speech = librosa.resample(speech, orig_sr=sample_rate, target_sr=target_sample_rate)
#     return speech, target_sample_rate


# # Route to convert voice to text
# @app.route('/voice-to-text', methods=['POST'])
# def voice_to_text():
#     try:
#         if 'file' not in request.files:
#             return jsonify({"error": "No file part"}), 400
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({"error": "No selected file"}), 400
#         if file:
#             audio_file_path = "uploaded_audio.wav"
#             file.save(audio_file_path)
#             app.logger.debug(f"Saved audio file to {audio_file_path}")

#             # Use the appropriate ASR model for English
#             model_name = "facebook/wav2vec2-large-960h"
#             processor = Wav2Vec2Processor.from_pretrained(model_name)
#             model = Wav2Vec2ForCTC.from_pretrained(model_name)

#             # Load and resample audio file
#             target_sample_rate = 16000
#             speech, sample_rate = load_and_resample_audio(audio_file_path, target_sample_rate)
#             app.logger.debug(f"Loaded audio file with sample rate: {sample_rate}")

#             # Tokenize the audio
#             input_values = processor(speech, return_tensors="pt", sampling_rate=sample_rate).input_values
#             app.logger.debug(f"Tokenized audio input values")

#             # Perform inference
#             with torch.no_grad():
#                 logits = model(input_values).logits
#             app.logger.debug(f"Model inference completed")

#             # Decode the logits
#             predicted_ids = torch.argmax(logits, dim=-1)
#             transcription = processor.batch_decode(predicted_ids)[0]
#             app.logger.debug(f"Transcription: {transcription}")

#             # Clean up the saved audio file
#             os.remove(audio_file_path)

#             return jsonify({"transcription": transcription})
#     except Exception as e:
#         app.logger.error(f"Error processing voice-to-text: {e}")
#         return jsonify({"error": "Failed to process audio file"}), 500

# if __name__ == '__main__':
#     app.run(port=5000)
