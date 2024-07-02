import requests
from fuzzywuzzy import process
from models.classification_model import classification_model, classification_tokenizer
from utils.audio_processing import audio_to_text, audio_to_text_v1
# from utils.text_processing import preprocess_options
import torch
from config.settings import QUESTION_SERVER_BASE_URL

    
def predict_service(category_id, category_type, message):
    url = f'{QUESTION_SERVER_BASE_URL}/{category_type}/{category_id}'
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch question options"}, response.status_code
         
    question_options = response.json()
    options = [q['value'] for q in question_options]
    processed_options = preprocess_options(options)
    corrected_input, score = process.extractOne(user_input, processed_options)

#    if score < 65:
#         command = detect_command(user_input)
#         if command in command_message_map:
#             return jsonify({"predictedMessage": command_message_map[command], "command": command})

# url = f'{QUESTION_SERVER_BASE_URL}/{category_type}/{category_id}/validated_message'

    inputs = classification_tokenizer(corrected_input, return_tensors="pt")

    with torch.no_grad():
        outputs = classification_model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax().item()

    response_data = {
        "predictedMessage": corrected_input,
        "command": f"{predicted_class_id}",
        "predictedMessageId": validatedAnswerId,
        "category_id": category_id,
        "category_type": category_type
    }

    return response_data

def preprocess_options(options):
    processed_options = []
    for option in options:
        # Remove leading numbers and dots
        processed_option = re.sub(r'^\d+\.\s*', '', option)
        processed_options.append(processed_option)
    return processed_options

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
    
def metadata_service(category_id, category_type, command):
    url = f'{QUESTION_SERVER_BASE_URL}/metadata'
    response = requests.get(url, params={
        "category_id": category_id,
        "category_type": category_type,
        "command": command
    })
    
    if response.status_code != 200:
        return {"error": "Failed to fetch metadata"}, response.status_code
    
    return response.json(), 200

def save_metadata_service(predicted_message, command, predicted_message_id, category_id, category_type):
    url = f'{QUESTION_SERVER_BASE_URL}/metadata/save'

    payload = {
        "predictedMessage": predicted_message,
        "command": command,
        "predictedMessageId": predicted_message_id,
        "category_id": category_id,
        "category_type": category_type
    }

    response = requests.post(url, json=payload)

    if response.status_code != 200:
        return {"error": "Failed to save metadata"}, response.status_code

    return response.json(), response.status_code