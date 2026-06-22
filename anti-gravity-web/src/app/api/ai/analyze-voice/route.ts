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

    // Send the transcription to Llama-3 to get real emotion inference
    let emotions = { stress: 0.2, anxiety: 0.2, sadness: 0.1, joy: 0.5, calmness: 0.6 };
    let recommendations = [
      "Take a moment to write in your journal to reflect on these thoughts.",
      "A short meditation session might help balance your current emotional state."
    ];

    try {
      const llmResponse = await fetch(
        "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: [
              { 
                role: "system", 
                content: "You are an emotion analysis engine. Read the following text and output ONLY a valid JSON object with the following numerical keys (0.0 to 1.0): 'stress', 'anxiety', 'sadness', 'joy', 'calmness', and a string array 'recommendations' with 2 helpful mental health tips. DO NOT output any markdown blocks or other text, ONLY the raw JSON string."
              },
              { role: "user", content: transcription }
            ],
            max_tokens: 300,
            stream: false
          }),
        }
      );

      if (llmResponse.ok) {
        const llmResult = await llmResponse.json();
        let content = llmResult.choices[0].message.content;
        // Strip markdown backticks if the model ignores the prompt
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(content);
        if (parsed.stress !== undefined) {
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
      } else {
        console.error("LLM Inference Error:", await llmResponse.text());
      }
    } catch (err) {
      console.error("Failed to parse emotions via LLM:", err);
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
