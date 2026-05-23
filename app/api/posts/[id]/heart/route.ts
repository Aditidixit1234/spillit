import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firebaseUid } = await req.json();

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await prisma.heart.findFirst({
      where: { postId: id, userId: user.id },
    });

    if (existing) {
      await prisma.heart.delete({ where: { id: existing.id } });
      await prisma.post.update({ where: { id }, data: { totalHearts: { decrement: 1 } } });
      return NextResponse.json({ message: "Unhearted", hearted: false }, { status: 200 });
    }

    await prisma.heart.create({ data: { postId: id, userId: user.id } });
    await prisma.post.update({ where: { id }, data: { totalHearts: { increment: 1 } } });
    return NextResponse.json({ message: "Hearted", hearted: true }, { status: 200 });
  } catch (error) {
    console.error("Heart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}