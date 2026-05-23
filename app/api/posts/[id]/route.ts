import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            anonName: true,
            rep: true,
            level: true,
            aura: true,
            accuracy: true,
            totalPredictions: true,
            rank: true,
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { anonName: true, rep: true } },
            replies: {
              include: {
                author: { select: { anonName: true, rep: true } },
              },
            },
          },
          orderBy: { totalHearts: "desc" },
        },
        _count: {
          select: { votes: true, comments: true, hearts: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firebaseUid } = await req.json();

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.post.update({ where: { id }, data: { status: "removed" } });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}