import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "rep";
    const limit = parseInt(searchParams.get("limit") || "10");

    const orderBy =
      sortBy === "accuracy"
        ? { accuracy: "desc" as const }
        : sortBy === "streak"
        ? { streak: "desc" as const }
        : { rep: "desc" as const };

    const users = await prisma.user.findMany({
      select: {
        id: true,
        anonName: true,
        rep: true,
        accuracy: true,
        streak: true,
        level: true,
        aura: true,
        badges: true,
        totalPredictions: true,
        correctPredictions: true,
        rank: true,
      },
      orderBy,
      take: limit,
    });

    // add rank numbers
    const ranked = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ users: ranked }, { status: 200 });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}