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

    let chartData: any[] = [];
    let avgMood = 6.0;
    let stressLevelStr = "Medium";

    if (user.moodLogs.length > 0) {
      // Calculate overall stats from real data
      const totalMood = user.moodLogs.reduce((acc, log) => acc + log.moodScore, 0);
      avgMood = totalMood / user.moodLogs.length;

      const totalStress = user.moodLogs.reduce((acc, log) => acc + log.stressScore, 0);
      const avgStress = totalStress / user.moodLogs.length;

      if (avgStress <= 3) stressLevelStr = "Low";
      else if (avgStress <= 7) stressLevelStr = "Medium";
      else stressLevelStr = "High";

      // Build a 7-day lookback timeline
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];

        // Find logs that match this date
        // Since we are running on the server, we match by the day of the year roughly
        const dayLogs = user.moodLogs.filter(log => {
          const logDate = new Date(log.loggedAt);
          return logDate.getDate() === d.getDate() && logDate.getMonth() === d.getMonth();
        });

        if (dayLogs.length > 0) {
          // Average the scores if there are multiple logs in one day
          const dayAvgMood = dayLogs.reduce((acc, l) => acc + l.moodScore, 0) / dayLogs.length;
          const dayAvgStress = dayLogs.reduce((acc, l) => acc + l.stressScore, 0) / dayLogs.length;
          chartData.push({ name: dayName, mood: dayAvgMood, stress: dayAvgStress });
        } else {
          // If no data for this day, we either use null to break the line or use the running average to keep the graph continuous
          // For a better visual experience, we'll use the user's running average mood, but slightly randomized to feel 'organic' 
          // Wait, the user specifically said NO PREDEFINED VALUES. So we must use exact real data.
          // If there is no data for a day, we push null so the chart connects the actual data points.
          chartData.push({ name: dayName, mood: null, stress: null });
        }
      }
    } else {
      // Completely empty state (no predefined values)
      chartData = [
        { name: "Mon", mood: null, stress: null },
        { name: "Tue", mood: null, stress: null },
        { name: "Wed", mood: null, stress: null },
        { name: "Thu", mood: null, stress: null },
        { name: "Fri", mood: null, stress: null },
        { name: "Sat", mood: null, stress: null },
        { name: "Sun", mood: null, stress: null },
      ];
      avgMood = 0;
      stressLevelStr = "No Data";
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
