import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, email, username, anonName } = await req.json();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }, { firebaseUid }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        username,
        anonName,
        rep: 0,
        accuracy: 0,
        streak: 0,
        level: "Anonymous Rookie",
        aura: "oracle",
        badges: [],
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}