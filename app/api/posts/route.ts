import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type"); // confession | prediction
    const skip = (page - 1) * limit;

   const where: { status: string; type?: string } = { status: "active" };
    if (type) where.type = type;

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            anonName: true,
            rep: true,
            level: true,
            aura: true,
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
      orderBy: { repScore: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({ posts, page, limit }, { status: 200 });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new post
export async function POST(req: NextRequest) {
  try {
    const {
      firebaseUid,
      type,
      text,
      tags,
      mood,
      anonLevel,
      audience,
      isPoll,
      options,
      deadline,
      mediaUrl,
      mediaType,
    } = await req.json();

    // find user
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // format poll options
    const formattedOptions = isPoll
      ? options.map((o: string) => ({ label: o, votes: 0 }))
      : null;

    const post = await prisma.post.create({
      data: {
        type,
        text,
        tags: tags || [],
        mood,
        anonLevel: anonLevel || "fully_anonymous",
        audience: audience || "For You",
        isPoll: isPoll || false,
        options: formattedOptions,
        deadline: deadline ? new Date(deadline) : null,
        mediaUrl,
        mediaType,
        authorId: user.id,
        repScore: 0,
      },
    });

    // give user +2 rep for posting
    await prisma.user.update({
      where: { id: user.id },
      data: { rep: { increment: 2 } },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}