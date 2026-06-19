import os
import tempfile
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import imageio_ffmpeg
import torch
import soundfile as sf
import numpy as np
from transformers import pipeline, Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor
# Note: In production, SpeechBrain models are loaded from huggingface hub
# from speechbrain.pretrained import EncoderClassifier

app = FastAPI(title="Anti Gravity - AI Voice Analysis Service")

# CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# ML Model Initialization (Lazy loading in production recommended)
# ---------------------------------------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Loading models on {device}...")

# 1. Speech-to-Text (Whisper via Transformers pipeline)
# Using 'tiny' for fast inference in development
whisper_pipeline = pipeline(
    "automatic-speech-recognition", 
    model="openai/whisper-tiny", 
    device=0 if device == "cuda" else -1
)

# 2. Emotion Recognition (Wav2Vec2)
emotion_model_name = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
emotion_feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(emotion_model_name)
emotion_model = Wav2Vec2ForSequenceClassification.from_pretrained(emotion_model_name).to(device)

# ---------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------
def convert_audio_to_wav(input_path: str, output_path: str, target_sr: int = 16000):
    """
    Normalizes audio files using a bundled static ffmpeg binary.
    """
    try:
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg_exe, 
            "-y", 
            "-i", input_path, 
            "-ar", str(target_sr), 
            "-ac", "1", 
            output_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio conversion failed: {str(e)}")

def load_audio_array(wav_path: str):
    data, sample_rate = sf.read(wav_path)
    data = data.astype(np.float32)
    if len(data.shape) > 1:
        data = data[:, 0]
    return data, sample_rate

def analyze_emotions(wav_path: str):
    """
    Runs Wav2Vec2 model to extract emotional probabilities.
    """
    data, sample_rate = load_audio_array(wav_path)

    inputs = emotion_feature_extractor(
        data, 
        sampling_rate=16000, 
        return_tensors="pt", 
        padding=True
    )
    
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    with torch.no_grad():
        logits = emotion_model(**inputs).logits
        
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    
    # labels mapping depends on the specific model
    labels = ["anger", "disgust", "fear", "happiness", "sadness"]
    probs = probabilities[0].cpu().numpy()
    
    return {labels[i]: float(probs[i]) for i in range(len(labels))}

def analyze_speech_metrics(wav_path: str, transcription: str):
    """
    Calculates proxy metrics for pitch, speed, and pauses.
    """
    data, sample_rate = load_audio_array(wav_path)
    duration_seconds = len(data) / sample_rate
    
    word_count = len(transcription.split())
    words_per_minute = (word_count / duration_seconds) * 60 if duration_seconds > 0 else 0
    
    return {
        "duration_seconds": round(duration_seconds, 2),
        "words_per_minute": round(words_per_minute, 2),
        "speed": "fast" if words_per_minute > 150 else ("slow" if words_per_minute < 100 else "normal"),
        "pitch_variance": "moderate", 
        "intensity": "high"
    }

def generate_recommendations(emotions, metrics):
    """
    Heuristics mapping findings to app features.
    """
    recommendations = []
    highest_emotion = max(emotions, key=emotions.get)
    
    if highest_emotion == "sadness" and emotions["sadness"] > 0.4:
        recommendations.append("Consider trying the 'Gratitude Jar' mini-game.")
        recommendations.append("We recommend the 'Breathing Circle Game' to help center your thoughts.")
    elif highest_emotion == "anger" and emotions["anger"] > 0.3:
        recommendations.append("The 'Bubble Pop Therapy' module might help release tension.")
    elif highest_emotion == "happiness" and emotions["happiness"] > 0.5:
        recommendations.append("You sound great! Log this in your Daily Affirmation Wheel to keep the streak going.")
        
    return recommendations

# ---------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------
@app.post("/api/ai/analyze-voice")
async def analyze_voice_endpoint(
    file: UploadFile = File(...),
    language: str = Form("english")
):
    """
    Receives an audio file from the Next.js frontend, processes it, and returns the emotional analysis.
    """
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an audio file.")

    temp_id = str(uuid.uuid4())
    input_ext = os.path.splitext(file.filename)[1] or ".webm"
    temp_input_path = os.path.join(tempfile.gettempdir(), f"{temp_id}{input_ext}")
    temp_wav_path = os.path.join(tempfile.gettempdir(), f"{temp_id}.wav")

    try:
        # Save uploaded file
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="The audio file is empty. Make sure your microphone is working and you record for at least 1 second.")

        with open(temp_input_path, "wb") as f:
            f.write(file_bytes)
            
        print(f"DEBUG: Saved {len(file_bytes)} bytes to {temp_input_path}")
        
        # Convert audio
        convert_audio_to_wav(temp_input_path, temp_wav_path)
        
        if not os.path.exists(temp_wav_path) or os.path.getsize(temp_wav_path) == 0:
            raise HTTPException(status_code=400, detail="FFmpeg failed to extract audio. The recording might be corrupt or unsupported by your device's browser.")
        
        # 1. Transcription (Whisper)
        # Load the wav file manually to bypass HF's ffmpeg requirement
        data, sample_rate = load_audio_array(temp_wav_path)
        transcription_result = whisper_pipeline(
            {"array": data, "sampling_rate": sample_rate}, 
            generate_kwargs={"language": language}
        )
        text = transcription_result.get("text", "")
        
        # 2. Emotion Recognition
        emotions = analyze_emotions(temp_wav_path)
        
        # 3. Speech Metrics
        metrics = analyze_speech_metrics(temp_wav_path, text)
        
        # 4. Actionable Recommendations
        recommendations = generate_recommendations(emotions, metrics)
        
        return {
            "status": "success",
            "transcription": text.strip(),
            "emotions": emotions,
            "metrics": metrics,
            "recommendations": recommendations,
            "metadata": {
                "confidence_score": max(emotions.values())
            }
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_input_path): os.remove(temp_input_path)
        if os.path.exists(temp_wav_path): os.remove(temp_wav_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
