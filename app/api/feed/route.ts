import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tab = searchParams.get("tab") || "For You";
    const skip = (page - 1) * limit;

    const where: { status: string; type?: string } = { status: "active" };
    if (tab === "Predictions") where.type = "prediction";
    if (tab === "Confessions") where.type = "confession";

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            anonName: true,
            rep: true,
            level: true,
            aura: true,
            accuracy: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
            hearts: true,
          },
        },
      },
      orderBy: [
        { repScore: "desc" },
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
    });

    // calculate rep score for each post
    const scored = posts.map((post) => {
      const score =
        post.totalVotes * 0.4 +
        post.totalComments * 0.3 +
        post.totalHearts * 0.2 +
        (post.author.rep / 1000) * 0.1;
      return { ...post, calculatedScore: score };
    });

    // sort by score
    scored.sort((a, b) => b.calculatedScore - a.calculatedScore);

    return NextResponse.json({ posts: scored, page, limit }, { status: 200 });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}