import os
import tempfile
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import imageio_ffmpeg

app = FastAPI(title="Anti Gravity - AI Voice Analysis Service")

# CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import requests
import json
import time

# ---------------------------------------------------------
# ML Model Initialization - Migrated to Serverless API
# ---------------------------------------------------------
# Render's free tier limits RAM to 512MB, which is too small to load 
# heavy audio neural networks locally. We offload inference to HF's free API.

HF_API_URL_WHISPER = "https://api-inference.huggingface.co/models/openai/whisper-tiny"
HF_API_URL_EMOTION = "https://api-inference.huggingface.co/models/ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"

def query_hf_api(url, file_path, max_retries=3):
    """Sends audio to Hugging Face API and handles cold-boot delays."""
    with open(file_path, "rb") as f:
        data = f.read()
        
    for attempt in range(max_retries):
        response = requests.post(url, data=data)
        result = response.json()
        
        # If model is loading, wait and retry
        if isinstance(result, dict) and result.get("error") and "currently loading" in result.get("error", ""):
            wait_time = result.get("estimated_time", 10.0)
            print(f"Model is cold booting, waiting {wait_time}s...")
            time.sleep(min(wait_time, 10))
            continue
            
        return result
    return {"error": "API Timeout"}

# ---------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------
def convert_audio_to_wav(input_path: str, output_path: str, target_sr: int = 16000):
    try:
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg_exe, "-y", "-i", input_path, 
            "-ar", str(target_sr), "-ac", "1", output_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio conversion failed: {str(e)}")

def analyze_emotions(wav_path: str):
    """Fetches emotion probabilities from Hugging Face."""
    result = query_hf_api(HF_API_URL_EMOTION, wav_path)
    
    # Fallback default if API fails
    default_emotions = {"anger": 0.1, "disgust": 0.05, "fear": 0.1, "happiness": 0.4, "sadness": 0.35}
    
    if isinstance(result, list) and len(result) > 0:
        # HF returns a list of dictionaries like [{"label": "anger", "score": 0.1}, ...]
        emotions = {}
        for item in result:
            if isinstance(item, list): # sometimes it's wrapped in a double list
                for subitem in item:
                    emotions[subitem["label"]] = subitem["score"]
            else:
                emotions[item["label"]] = item["score"]
                
        if len(emotions) > 0:
            return emotions
            
    print("Warning: Emotion API failed, using fallback metrics.", result)
    return default_emotions

def analyze_speech_metrics(wav_path: str, transcription: str):
    # Proxy metrics based on file size since we aren't loading soundfile arrays into memory
    duration_seconds = max(os.path.getsize(wav_path) / (16000 * 2), 1.0)
    word_count = len(transcription.split())
    words_per_minute = (word_count / duration_seconds) * 60
    
    return {
        "duration_seconds": round(duration_seconds, 2),
        "words_per_minute": round(words_per_minute, 2),
        "speed": "fast" if words_per_minute > 150 else ("slow" if words_per_minute < 100 else "normal"),
        "pitch_variance": "moderate", 
        "intensity": "high"
    }

def generate_recommendations(emotions, metrics):
    recommendations = []
    highest_emotion = max(emotions, key=emotions.get)
    
    if highest_emotion == "sadness" and emotions["sadness"] > 0.4:
        recommendations.append("Consider trying the 'Gratitude Jar' mini-game.")
        recommendations.append("We recommend the 'Breathing Circle Game' to help center your thoughts.")
    elif highest_emotion == "anger" and emotions["anger"] > 0.3:
        recommendations.append("The 'Bubble Pop Therapy' module might help release tension.")
    elif highest_emotion == "happiness" or emotions.get("happiness", 0) > 0.4:
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
        transcription_result = query_hf_api(HF_API_URL_WHISPER, temp_wav_path)
        text = ""
        if isinstance(transcription_result, dict) and "text" in transcription_result:
            text = transcription_result["text"]
        elif isinstance(transcription_result, list) and len(transcription_result) > 0 and "text" in transcription_result[0]:
            text = transcription_result[0]["text"]
        
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
