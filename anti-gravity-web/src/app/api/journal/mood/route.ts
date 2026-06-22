import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { moodScore, stressScore } = await req.json();

    if (moodScore == null || stressScore == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const moodLog = await prisma.moodLog.create({
      data: {
        userId: user.id,
        moodScore: Number(moodScore),
        stressScore: Number(stressScore),
      },
    });

    return NextResponse.json({ success: true, moodLog }, { status: 201 });
  } catch (error: any) {
    console.error("Mood logging error:", error);
    return NextResponse.json({ error: "Failed to save mood log" }, { status: 500 });
  }
}
