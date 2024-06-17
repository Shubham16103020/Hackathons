import torch
from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
from config.settings import SUPPORTED_LANGUAGES

def convert_language(input_text, src_lang, target_lang):
    model_name = SUPPORTED_LANGUAGES.get("general")
    tokenizer = M2M100Tokenizer.from_pretrained(model_name)
    model = M2M100ForConditionalGeneration.from_pretrained(model_name)

    # Tokenize the input text
    tokenizer.src_lang = src_lang
    encoded_input = tokenizer(input_text, return_tensors="pt")

    # Generate translation
    generated_tokens = model.generate(**encoded_input, forced_bos_token_id=tokenizer.get_lang_id(target_lang))
    translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    
    return translated_text
