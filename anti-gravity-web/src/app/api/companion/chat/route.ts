import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, persona } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const activePersona = persona || "Supportive Friend";
    
    const systemPrompts: Record<string, string> = {
      "Supportive Friend": "You are a highly empathetic, warm, and supportive friend. Keep your responses concise (under 3 sentences). Listen actively and offer gentle encouragement.",
      "Professional Therapist": "You are a professional therapist using CBT principles. Ask guiding questions to help the user explore their feelings. Keep your responses concise (under 3 sentences).",
      "Motivational Coach": "You are a high-energy motivational coach. You inspire action, focus on the positive, and push the user to achieve their goals. Keep your responses concise and energetic.",
      "Funny Buddy": "You are a witty, sarcastic, but ultimately caring buddy. Use humor to lighten the mood. Keep your responses concise and funny.",
      "Spiritual Guide": "You are a peaceful spiritual guide. Use mindfulness principles, focus on the present moment, and speak calmly. Keep your responses concise and philosophical."
    };

    const systemPrompt = systemPrompts[activePersona] || systemPrompts["Supportive Friend"];

    let aiResponse = "I'm having trouble connecting to my brain right now. Can we try again?";

    if (process.env.HF_TOKEN) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions",
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              model: "meta-llama/Meta-Llama-3-8B-Instruct",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
              ],
              max_tokens: 150,
              stream: false
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          aiResponse = result.choices[0].message.content;
        } else {
          console.error("HF API Error:", await response.text());
        }
      } catch (err) {
        console.error("Fetch to HF failed:", err);
      }
    } else {
      // Fallback if no token is provided during development
      console.warn("No HF_TOKEN found. Using fallback.");
      aiResponse = `[Real AI Disabled - Missing HF_TOKEN] As your ${activePersona}, I hear you saying: "${message}".`;
    }

    return NextResponse.json({
      role: "assistant",
      content: aiResponse
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
