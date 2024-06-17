# from flask import Flask, request, jsonify
# from transformers import MarianMTModel, MarianTokenizer

# app = Flask(__name__)

# # Define supported language codes and corresponding model names
# supported_languages = {
#     "hindi": "Helsinki-NLP/opus-mt-en-hi",
#     "spanish": "Helsinki-NLP/opus-mt-en-es",
#     # Add more supported languages and corresponding model names as needed
# }

# @app.route('/convert-language', methods=['POST'])
# def convert_language():
#     data = request.get_json(force=True)
#     text = data.get("text")
#     target_language = data.get("target_language")

#     if not text or not target_language:
#         return jsonify({"error": "Invalid input data"}), 400

#     # Check if the target language is supported
#     if target_language.lower() not in supported_languages:
#         return jsonify({"error": "Target language not supported"}), 400

#     # Load the MarianMT model and tokenizer for the target language
#     model_name = supported_languages[target_language.lower()]
#     model = MarianMTModel.from_pretrained(model_name)
#     tokenizer = MarianTokenizer.from_pretrained(model_name)

#     # Tokenize the input text and convert to target language
#     inputs = tokenizer([text], return_tensors="pt", padding=True, truncation=True)
#     translated_output = model.generate(**inputs, max_length=200, num_beams=4, early_stopping=True)

#     # Decode the translated output
#     translated_text = tokenizer.batch_decode(translated_output, skip_special_tokens=True)[0]

#     return jsonify({"input": text, "target_language": target_language, "converted_text": translated_text})

# if __name__ == '__main__':
#     app.run(port=5000)
