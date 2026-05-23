import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET flagged posts
export async function GET(req: NextRequest) {
  try {
    const flags = await prisma.flag.findMany({
      where: { status: "pending" },
      include: {
        post: {
          select: {
            id: true,
            type: true,
            text: true,
            status: true,
            reportCount: true,
            author: {
              select: { anonName: true },
            },
          },
        },
        reporter: {
          select: { anonName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ flags }, { status: 200 });
  } catch (error) {
    console.error("Moderation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// FLAG a post
export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, postId, reason, severity } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const flag = await prisma.flag.create({
      data: {
        postId,
        reporterId: user.id,
        reason,
        severity: severity || "low",
      },
    });

    // increment report count
    await prisma.post.update({
      where: { id: postId },
      data: { reportCount: { increment: 1 } },
    });

    return NextResponse.json({ flag }, { status: 201 });
  } catch (error) {
    console.error("Flag error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// MODERATE a post (approve/remove/warn)
export async function PUT(req: NextRequest) {
  try {
    const { firebaseUid, postId, action, reason } = await req.json();

    const mod = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!mod) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // update post status
    await prisma.post.update({
      where: { id: postId },
      data: { status: action },
    });

    // log moderation action
    await prisma.moderationAction.create({
      data: {
        postId,
        modId: mod.id,
        action,
        reason,
      },
    });

    // resolve all flags for this post
    await prisma.flag.updateMany({
      where: { postId },
      data: { status: "resolved" },
    });

    return NextResponse.json(
      { message: `Post ${action} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Moderation action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}