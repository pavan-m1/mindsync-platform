import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch journal entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // AI Summarization placeholder - in a real app this would call an LLM (e.g. OpenAI/HuggingFace)
    // For now, we will generate a simple summary string based on the content length.
    let aiSummary = "Your entry reflects a neutral tone.";
    if (content.toLowerCase().includes("happy") || content.toLowerCase().includes("great")) {
      aiSummary = "You seem to be having a great day!";
    } else if (content.toLowerCase().includes("sad") || content.toLowerCase().includes("stress")) {
      aiSummary = "It looks like you're going through a stressful period. Remember to breathe.";
    }

    const newEntry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        title: title || "Untitled Entry",
        content,
        aiSummary,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
