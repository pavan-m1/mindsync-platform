"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, Play, Volume2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function VoiceAnalysisPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setError("Microphone access denied or unavailable.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("language", language);

      const response = await fetch(`/api/ai/analyze-voice`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to process audio on the server.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Formatting data for Recharts Radar
  const formatRadarData = (emotions: Record<string, number>) => {
    if (!emotions) return [];
    return Object.keys(emotions).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: Math.round(emotions[key] * 100),
      fullMark: 100,
    }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Voice Analysis</h1>
        <p className="text-slate-400">Speak your mind. Our AI will transcribe and analyze your emotional acoustic resonance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Recorder UI */}
        <div className="glass-panel p-8 flex flex-col items-center justify-center space-y-8 h-[400px]">
          
          <div className="w-full max-w-xs space-y-2">
            <label className="text-sm font-medium text-slate-300">Spoken Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isRecording || isProcessing}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi (हिंदी)</option>
              <option value="kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-xl ${
                isRecording 
                  ? "bg-red-500/20 text-red-500 border-2 border-red-500 animate-pulse" 
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30"
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
              
              {/* Ripple Effect when recording */}
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />
              )}
            </button>
            <p className={`text-lg font-medium ${isRecording ? 'text-red-400' : 'text-slate-400'}`}>
              {isRecording ? "Recording... Click to Stop" : "Click to Record"}
            </p>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        {/* Right Column: Processing or Results */}
        <div className="glass-panel p-8 h-[400px] flex flex-col justify-center relative overflow-hidden">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-blue-400 h-full">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-medium animate-pulse">Running Multilingual Emotion Extraction...</p>
            </div>
          ) : result ? (
            <div className="h-full flex flex-col text-slate-200 fade-in duration-500 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xl font-semibold text-white mb-4">Analysis Complete</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Transcription
                  </h4>
                  <p className="text-sm font-medium leading-relaxed">"{result.transcription}"</p>
                </div>

                <div className="h-48 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formatRadarData(result.emotions)}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Emotion %" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {result.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400">AI Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm text-teal-300 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 h-full">
              <Radar className="w-16 h-16 mb-4 opacity-20" />
              <p>Your analysis results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
