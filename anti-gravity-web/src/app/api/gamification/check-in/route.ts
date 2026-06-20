import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let gameState = await prisma.gamificationState.findUnique({
      where: { userId: user.id },
    });

    // Create state if it doesn't exist
    if (!gameState) {
      gameState = await prisma.gamificationState.create({
        data: {
          userId: user.id,
          currentStreak: 0,
          highestStreak: 0,
          level: "Beginner",
          xp: 0,
        },
      });
    }

    const now = new Date();
    const lastCheckIn = gameState.lastCheckIn ? new Date(gameState.lastCheckIn) : null;
    
    let isAlreadyCheckedInToday = false;
    let newStreak = gameState.currentStreak;
    let newXp = gameState.xp;

    if (lastCheckIn) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const checkInDay = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate());
      const diffTime = Math.abs(today.getTime() - checkInDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        isAlreadyCheckedInToday = true;
      } else if (diffDays === 1) {
        // Checked in yesterday, continue streak
        newStreak += 1;
        newXp += 50;
      } else {
        // Missed a day, reset streak
        newStreak = 1;
        newXp += 50;
      }
    } else {
      // First ever check-in
      newStreak = 1;
      newXp += 50;
    }

    if (isAlreadyCheckedInToday) {
      return NextResponse.json({ 
        message: "Already checked in today", 
        gameState 
      }, { status: 200 });
    }

    const highestStreak = Math.max(gameState.highestStreak, newStreak);
    
    // Simple level progression
    let newLevel = gameState.level;
    if (newXp >= 1000) newLevel = "Zen Master";
    else if (newXp >= 500) newLevel = "Mindful Guru";
    else if (newXp >= 200) newLevel = "Calm Seeker";

    const updatedState = await prisma.gamificationState.update({
      where: { userId: user.id },
      data: {
        currentStreak: newStreak,
        highestStreak,
        xp: newXp,
        level: newLevel,
        lastCheckIn: now,
      },
    });

    return NextResponse.json({ 
      message: "Check-in successful", 
      gameState: updatedState 
    }, { status: 200 });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    let gameState = await prisma.gamificationState.findUnique({
      where: { userId: user.id },
    });

    if (!gameState) {
      gameState = await prisma.gamificationState.create({
        data: { userId: user.id },
      });
    }

    return NextResponse.json({ gameState }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
