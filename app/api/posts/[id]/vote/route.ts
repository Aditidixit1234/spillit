import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { firebaseUid, optionIndex } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post || !post.isPoll) {
      return NextResponse.json(
        { error: "Post not found or not a poll" },
        { status: 404 }
      );
    }

    // check already voted
    const existing = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already voted" },
        { status: 400 }
      );
    }

    // create vote
    await prisma.vote.create({
      data: {
        postId: params.id,
        userId: user.id,
        optionIndex,
      },
    });

    // update poll options votes count
   const options = post.options as { label: string; votes: number }[];
    options[optionIndex].votes += 1;

    await prisma.post.update({
      where: { id: params.id },
      data: {
        options,
        totalVotes: { increment: 1 },
      },
    });

    return NextResponse.json(
      { message: "Vote cast successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}