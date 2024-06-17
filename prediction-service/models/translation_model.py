from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer
from config.settings import SUPPORTED_LANGUAGES

model_name = SUPPORTED_LANGUAGES.get("general")
translation_tokenizer = M2M100Tokenizer.from_pretrained(model_name)
translation_model = M2M100ForConditionalGeneration.from_pretrained(model_name)
