import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firebaseUid, text, parentId } = await req.json();

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const comment = await prisma.comment.create({
      data: {
        text,
        postId: id,
        authorId: user.id,
        parentId: parentId || null,
      },
      include: {
        author: { select: { anonName: true, rep: true } },
      },
    });

    await prisma.post.update({
      where: { id },
      data: { totalComments: { increment: 1 } },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { rep: { increment: 1 } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}