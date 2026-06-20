import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { specialistId, specialistName, date, time, reason } = body;

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        specialistId,
        specialistName,
        date,
        time,
        reason,
        status: "Confirmed",
      },
    });

    return NextResponse.json({ message: "Booking confirmed", appointment }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: (session as any).user.email },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
