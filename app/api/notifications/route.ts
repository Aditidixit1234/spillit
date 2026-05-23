import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET notifications
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "firebaseUid required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unread = notifications.filter((n) => !n.read).length;

    return NextResponse.json(
      { notifications, unread },
      { status: 200 }
    );
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// MARK as read
export async function PUT(req: NextRequest) {
  try {
    const { firebaseUid, notificationId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } else {
      // mark all as read
      await prisma.notification.updateMany({
        where: { userId: user.id },
        data: { read: true },
      });
    }

    return NextResponse.json(
      { message: "Marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}