import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET()  {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "active" },
      include: {
        author: {
          select: {
            anonName: true,
            rep: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // trending algorithm
    const now = Date.now();
    const scored = posts.map((post) => {
      const ageHours =
        (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

      // score formula
      const score =
        post.totalVotes * 0.4 +
        post.totalComments * 0.3 +
        post.totalHearts * 0.2 +
        (post.author.rep / 1000) * 0.1 -
        ageHours * 0.5; // decay over time

      return { ...post, trendingScore: score };
    });

    // sort by trending score
    scored.sort((a, b) => b.trendingScore - a.trendingScore);

    // mark top 10 as trending
    const trending = scored.slice(0, 10);

    // update trending status in db
    await Promise.all(
      trending.map((post) =>
        prisma.post.update({
          where: { id: post.id },
          data: {
            isTrending: true,
            repScore: post.trendingScore,
            isViral: post.trendingScore > 100,
          },
        })
      )
    );

    // get trending tags
    const allTags = trending.flatMap((p) => p.tags);
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const trendingTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return NextResponse.json(
      { trending, trendingTags },
      { status: 200 }
    );
  } catch (error) {
    console.error("Trending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}