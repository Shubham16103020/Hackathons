import soundfile as sf
import librosa
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torch

def load_and_resample_audio(file_path, target_sample_rate):
    speech, sample_rate = sf.read(file_path)
    if sample_rate != target_sample_rate:
        speech = librosa.resample(speech, orig_sr=sample_rate, target_sr=target_sample_rate)
    return speech, target_sample_rate

def audio_to_text_v1(file_path):
    model_name = "facebook/wav2vec2-large-960h"
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name)

    target_sample_rate = 16000
    speech, sample_rate = load_and_resample_audio(file_path, target_sample_rate)
    input_values = processor(speech, return_tensors="pt", sampling_rate=sample_rate).input_values

    with torch.no_grad():
        logits = model(input_values).logits

    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]

    return transcription

def audio_to_text(audio_file):
    model_name = "facebook/wav2vec2-large-960h"
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name)

    audio_content = audio_file.read()
    speech_array, sample_rate = sf.read(BytesIO(audio_content))
    target_sample_rate = 16000
    if sample_rate != target_sample_rate:
        speech_array = librosa.resample(speech_array, orig_sr=sample_rate, target_sr=target_sample_rate)

    input_values = processor(speech_array, return_tensors="pt", sampling_rate=target_sample_rate).input_values

    with torch.no_grad():
        logits = model(input_values).logits

    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]

    return transcription
