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

    // Call Hugging Face API for Speech-to-Text
    // We use a public inference endpoint for demonstration.
    // Ensure you have HF_TOKEN in your .env
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      console.warn("HF_TOKEN missing, returning mock transcription.");
      return NextResponse.json({
        transcription: "I have been feeling really overwhelmed lately with work and personal life.",
        emotions: {
          stress: 0.8,
          anxiety: 0.6,
          sadness: 0.4,
          joy: 0.1,
          anger: 0.2
        },
        recommendations: [
          "Try the 5-minute deep breathing exercise in Gamification.",
          "Consider speaking to one of our licensed therapists about your stress.",
          "Write down three things you accomplished today in your journal."
        ]
      }, { status: 200 });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-tiny",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "audio/webm",
        },
        method: "POST",
        body: buffer,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF API Error:", errText);
      throw new Error("Failed to transcribe audio via Hugging Face.");
    }

    const result = await response.json();
    const transcription = result.text || "No speech detected.";

    // Simple mock heuristic for emotions based on text length / keywords
    // In a real app, you would pass this transcription to a Text Classification model
    const textLower = transcription.toLowerCase();
    
    let stress = 0.3;
    let anxiety = 0.3;
    let sadness = 0.2;
    let joy = 0.5;

    if (textLower.includes("overwhelmed") || textLower.includes("stress") || textLower.includes("hard")) {
      stress += 0.5;
      anxiety += 0.3;
      joy -= 0.3;
    }
    if (textLower.includes("sad") || textLower.includes("depressed") || textLower.includes("lonely")) {
      sadness += 0.6;
      joy -= 0.4;
    }
    if (textLower.includes("happy") || textLower.includes("good") || textLower.includes("great")) {
      joy += 0.4;
      stress -= 0.2;
    }

    return NextResponse.json({
      transcription,
      emotions: {
        stress: Math.min(1, Math.max(0, stress)),
        anxiety: Math.min(1, Math.max(0, anxiety)),
        sadness: Math.min(1, Math.max(0, sadness)),
        joy: Math.min(1, Math.max(0, joy)),
        calmness: Math.min(1, Math.max(0, 1 - stress))
      },
      recommendations: [
        "Take a moment to write in your journal to reflect on these thoughts.",
        "A short meditation session might help balance your current emotional state."
      ]
    }, { status: 200 });

  } catch (error: any) {
    console.error("Voice analysis error:", error);
    return NextResponse.json({ detail: error.message || "Internal server error" }, { status: 500 });
  }
}
