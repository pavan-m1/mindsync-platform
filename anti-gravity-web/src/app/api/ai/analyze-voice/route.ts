import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const language = formData.get("language") as string;

    if (!file) {
      return NextResponse.json({ detail: "No audio file provided" }, { status: 400 });
    }

    // Convert Blob to ArrayBuffer for Hugging Face API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Gemini API for Speech-to-Text and Emotion Analysis
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing, returning mock transcription.");
      return NextResponse.json({
        transcription: "I have been feeling really overwhelmed lately with work and personal life.",
        emotions: {
          stress: 0.8,
          anxiety: 0.6,
          sadness: 0.4,
          joy: 0.1,
          calmness: 0.2
        },
        recommendations: [
          "Try the 5-minute deep breathing exercise in Gamification.",
          "Consider speaking to one of our licensed therapists about your stress.",
          "Write down three things you accomplished today in your journal."
        ]
      }, { status: 200 });
    }

    const base64Audio = buffer.toString("base64");
    let transcription = "No speech detected.";
    let emotions = { stress: 0.2, anxiety: 0.2, sadness: 0.1, joy: 0.5, calmness: 0.6 };
    let recommendations = [
      "Take a moment to write in your journal to reflect on these thoughts.",
      "A short meditation session might help balance your current emotional state."
    ];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inlineData: {
                    mimeType: file.type || "audio/webm",
                    data: base64Audio
                  }
                },
                { 
                  text: "You are an emotion analysis engine. Analyze the audio and provide the text transcription. Then analyze the emotion. Output ONLY a valid JSON object with a 'transcription' string key, and the following numerical keys (0.0 to 1.0): 'stress', 'anxiety', 'sadness', 'joy', 'calmness', and a string array 'recommendations' with 2 helpful mental health tips." 
                }
              ]
            }],
            generationConfig: {
              maxOutputTokens: 500,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API Error:", errText);
        throw new Error("Failed to transcribe audio via Gemini.");
      }

      const result = await response.json();
      const contentText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (contentText) {
        let parsed = JSON.parse(contentText);
        transcription = parsed.transcription || transcription;
        emotions = {
          stress: parsed.stress || 0,
          anxiety: parsed.anxiety || 0,
          sadness: parsed.sadness || 0,
          joy: parsed.joy || 0,
          calmness: parsed.calmness || 0
        };
        if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          recommendations = parsed.recommendations;
        }
      }
    } catch (err) {
      console.error("Failed to analyze voice via Gemini:", err);
    }

    return NextResponse.json({
      transcription,
      emotions,
      recommendations
    }, { status: 200 });

  } catch (error: any) {
    console.error("Voice analysis error:", error);
    return NextResponse.json({ detail: error.message || "Internal server error" }, { status: 500 });
  }
}
