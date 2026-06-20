import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const RESPONSES: Record<string, string[]> = {
  "Supportive Friend": [
    "I hear you, and I'm always here for you. Tell me more about that.",
    "That sounds tough. Do you want to vent, or are you looking for a distraction?",
    "You've got this! I believe in you so much.",
  ],
  "Professional Therapist": [
    "How does that make you feel when it happens?",
    "Let's explore that thought a bit deeper. What do you think is the root cause?",
    "It's completely normal to feel that way under these circumstances.",
  ],
  "Motivational Coach": [
    "You can crush this! What's the very first step you can take today?",
    "Every setback is a setup for a comeback. Let's go!",
    "I want you to visualize your success. You are unstoppable!",
  ],
  "Funny Buddy": [
    "Well that sounds like a mess. Have you tried turning it off and on again?",
    "If stress burned calories, we'd both be supermodels by now.",
    "I'm here for you! Mostly because I have nowhere else to be, but still!",
  ],
  "Spiritual Guide": [
    "Breathe in the present moment. Let go of what you cannot control.",
    "Your energy flows where your intention goes.",
    "Find peace in the stillness. You are exactly where you need to be.",
  ]
};

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
    const availableResponses = RESPONSES[activePersona] || RESPONSES["Supportive Friend"];
    
    // Pick a random response based on the persona
    const randomResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];

    return NextResponse.json({
      role: "assistant",
      content: randomResponse
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
