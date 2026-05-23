import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Calculate and update user reputation
export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, action } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // rep values for each action
    const REP_VALUES: Record<string, number> = {
      correct_prediction: 12,
      wrong_prediction: -4,
      post_created: 2,
      comment_created: 1,
      streak_bonus: 5,
      trending_post: 20,
      viral_post: 50,
      heart_received: 1,
    };

    const repChange = REP_VALUES[action] || 0;

    // update rep
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        rep: { increment: repChange },
      },
    });

    // update accuracy if prediction related
    if (
      action === "correct_prediction" ||
      action === "wrong_prediction"
    ) {
      const isCorrect = action === "correct_prediction";

      const updatedPredictions = await prisma.user.update({
        where: { id: user.id },
        data: {
          totalPredictions: { increment: 1 },
          correctPredictions: isCorrect ? { increment: 1 } : undefined,
          wrongPredictions: !isCorrect ? { increment: 1 } : undefined,
        },
      });

      // recalculate accuracy
      const accuracy =
        updatedPredictions.totalPredictions > 0
          ? (updatedPredictions.correctPredictions /
              updatedPredictions.totalPredictions) *
            100
          : 0;

      await prisma.user.update({
        where: { id: user.id },
        data: { accuracy: Math.round(accuracy) },
      });
    }

    // update level based on rep
    const newLevel = getLevel(updated.rep);
    if (newLevel !== user.level) {
      await prisma.user.update({
        where: { id: user.id },
        data: { level: newLevel },
      });

      // create badge notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "badge",
          title: `Level up! You are now ${newLevel}`,
          body: `Your reputation has grown. Keep predicting!`,
          icon: "🏆",
          color: "#6c5ce7",
        },
      });
    }

    // create rep notification
    if (repChange !== 0) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "rep",
          title: repChange > 0 ? `+${repChange} rep earned` : `${repChange} rep deducted`,
          body: getRepMessage(action, repChange),
          icon: "⚡",
          color: repChange > 0 ? "#0f6e56" : "#e84393",
          repChange,
        },
      });
    }

    return NextResponse.json(
      { repChange, newRep: updated.rep },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reputation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getLevel(rep: number): string {
  if (rep >= 8000) return "Elite Predictor";
  if (rep >= 5000) return "Prophet";
  if (rep >= 2000) return "Oracle";
  if (rep >= 500)  return "Truth Seeker";
  return "Anonymous Rookie";
}

function getRepMessage(action: string, rep: number): string {
  const messages: Record<string, string> = {
    correct_prediction: "Your prediction was correct! Great call.",
    wrong_prediction: "Your prediction was incorrect. Better luck next time.",
    post_created: "Thanks for posting! Keep sharing.",
    comment_created: "Thanks for joining the conversation!",
    streak_bonus: "Streak bonus! You've been active daily.",
    trending_post: "Your post is trending! Bonus rep awarded.",
    viral_post: "Your post went viral! Massive rep bonus.",
    heart_received: "Someone hearted your post!",
  };
  return messages[action] || `Rep ${rep > 0 ? "added" : "deducted"}.`;
}