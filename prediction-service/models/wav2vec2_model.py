from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

wav2vec2_model_name = "facebook/wav2vec2-large-960h"
wav2vec2_processor = Wav2Vec2Processor.from_pretrained(wav2vec2_model_name)
wav2vec2_model = Wav2Vec2ForCTC.from_pretrained(wav2vec2_model_name)
