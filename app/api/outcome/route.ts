import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { postId, winningOption, firebaseUid } = await req.json();

    const mod = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!mod) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // reveal the outcome
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        revealed: true,
        winningOption,
      },
    });

    // find all voters
    const votes = await prisma.vote.findMany({
      where: { postId },
      include: { user: true },
    });

    // notify and update rep for each voter
    await Promise.all(
      votes.map(async (vote) => {
        const isCorrect = vote.optionIndex === winningOption;
        const repChange = isCorrect ? 12 : -4;

        // update rep
        await prisma.user.update({
          where: { id: vote.userId },
          data: {
            rep: { increment: repChange },
            totalPredictions: { increment: 1 },
            correctPredictions: isCorrect ? { increment: 1 } : undefined,
            wrongPredictions: !isCorrect ? { increment: 1 } : undefined,
          },
        });

        // send notification
        await prisma.notification.create({
          data: {
            userId: vote.userId,
            type: "outcome",
            title: isCorrect
              ? "✅ Prediction correct! +12 rep"
              : "❌ Prediction incorrect. -4 rep",
            body: `The outcome for "${post.text.slice(0, 60)}..." has been revealed.`,
            icon: isCorrect ? "✅" : "❌",
            color: isCorrect ? "#0f6e56" : "#e84393",
            repChange,
            actionUrl: `/post/${postId}`,
          },
        });
      })
    );

    return NextResponse.json(
      { message: "Outcome revealed and users notified" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Outcome error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}