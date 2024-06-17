from utils.audio_processing import audio_to_text_v1
import os

def audio_to_text_service(file):
    audio_file_path = "uploaded_audio.wav"
    file.save(audio_file_path)
    transcription = audio_to_text_v1(audio_file_path)
    os.remove(audio_file_path)
    return {"transcription": transcription}
