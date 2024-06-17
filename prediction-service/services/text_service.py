import requests
from fuzzywuzzy import process
from models.classification_model import classification_model, classification_tokenizer
from utils.audio_processing import audio_to_text, audio_to_text_v1
from utils.text_processing import preprocess_options
import torch
from config.settings import QUESTION_SERVER_BASE_URL

    
def predict_service(user_input, question_id, target_language="en"):
    response = requests.get(f'{QUESTION_SERVER_BASE_URL}/questions/{question_id}/answers')
    if response.status_code != 200:
        return {"error": "Failed to fetch question options"}, response.status_code

    question_options = response.json()
    options = [q['value'] for q in question_options]
    corrected_input, score = process.extractOne(user_input, options)

    if score < 65:
        return {"error": "Please select correct option"}, 400

    return {"input": corrected_input}

def predict_service_v1(file, question_id):
    audio_file_path = "uploaded_audio.wav"
    file.save(audio_file_path)
    user_input = audio_to_text_v1(audio_file_path)
    os.remove(audio_file_path)

    response = requests.get(f'{QUESTION_SERVER_BASE_URL}/questions/{question_id}/answers')
    if response.status_code != 200:
        return {"error": "Failed to fetch question options"}, response.status_code

    question_options = response.json()
    options = [q['value'] for q in question_options]
    processed_options = preprocess_options(options)
    corrected_input, score = process.extractOne(user_input, processed_options)

    if score < 65:
        return {"error": "Please select correct option"}, 400

    inputs = classification_tokenizer(corrected_input, return_tensors="pt")

    with torch.no_grad():
        outputs = classification_model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax().item()

    return {"input": corrected_input, "prediction": predicted_class_id}
