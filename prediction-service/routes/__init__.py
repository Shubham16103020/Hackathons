# routes/__init__.py
from flask import Flask
from .predict import predict_bp
from .convert_language import convert_language_bp
from .voice_to_text import voice_to_text_bp

def register_routes(app: Flask):
    app.register_blueprint(predict_bp)
    app.register_blueprint(convert_language_bp)
    app.register_blueprint(voice_to_text_bp)
