import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email },
      include: {
        gamificationState: true,
        moodLogs: {
          orderBy: { loggedAt: 'asc' },
          take: 7, // Last 7 logs for the weekly trend
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default mock data in case user has no logs yet
    const defaultData = [
      { name: "Mon", mood: 6, stress: 5 },
      { name: "Tue", mood: 6, stress: 5 },
      { name: "Wed", mood: 6, stress: 5 },
      { name: "Thu", mood: 6, stress: 5 },
      { name: "Fri", mood: 6, stress: 5 },
      { name: "Sat", mood: 6, stress: 5 },
      { name: "Sun", mood: 6, stress: 5 },
    ];

    let chartData = defaultData;
    let avgMood = 6.0;
    let stressLevelStr = "Medium";

    if (user.moodLogs.length > 0) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      chartData = user.moodLogs.map(log => ({
        name: days[new Date(log.loggedAt).getDay()],
        mood: log.moodScore,
        stress: log.stressScore,
      }));
      
      const totalMood = user.moodLogs.reduce((acc, log) => acc + log.moodScore, 0);
      avgMood = totalMood / user.moodLogs.length;

      const totalStress = user.moodLogs.reduce((acc, log) => acc + log.stressScore, 0);
      const avgStress = totalStress / user.moodLogs.length;

      if (avgStress <= 3) stressLevelStr = "Low";
      else if (avgStress <= 7) stressLevelStr = "Medium";
      else stressLevelStr = "High";
    }

    const payload = {
      chartData,
      stats: {
        averageMood: avgMood.toFixed(1),
        stressLevel: stressLevelStr,
        currentStreak: user.gamificationState?.currentStreak || 0
      }
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
