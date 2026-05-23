import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { anonName: username },
          { anonName: `@${username}` },
        ],
      },
      select: {
        id: true,
        anonName: true,
        bio: true,
        signature: true,
        rep: true,
        accuracy: true,
        streak: true,
        level: true,
        aura: true,
        badges: true,
        totalPredictions: true,
        correctPredictions: true,
        wrongPredictions: true,
        rank: true,
        createdAt: true,
        posts: {
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            type: true,
            text: true,
            tags: true,
            totalVotes: true,
            totalHearts: true,
            totalComments: true,
            isPoll: true,
            revealed: true,
            winningOption: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  _ctx: unknown
) {
  try {
    const { firebaseUid, bio, signature, aura } = await req.json();

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { bio, signature, aura },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}