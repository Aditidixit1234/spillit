import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const today = new Date();
    const lastActive = user.lastActiveDate;
    let streak = user.streak;

    if (lastActive) {
      const diff = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) streak += 1;
      else if (diff > 1) streak = 0;
    }

    const updated = await prisma.user.update({
      where: { firebaseUid },
      data: { lastActiveDate: today, streak },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}