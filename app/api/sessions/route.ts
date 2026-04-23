import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createStudySession,
  deleteStudySession,
  getSessionsDashboardData,
} from "@/features/sessions/repository";
import { createSessionSchema } from "@/features/sessions/validation";
import { jsonError } from "@/lib/http";

export async function GET() {
  try {
    const data = await getSessionsDashboardData();

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch sessions", error);
    return jsonError("Unable to load study sessions right now.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid study session payload.");
    }

    const session = await createStudySession(parsed.data);

    return NextResponse.json(
      {
        data: {
          ...session,
          startedAt: session.startedAt.toISOString(),
          completedAt: session.completedAt.toISOString(),
          createdAt: session.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create session", error);
    return jsonError("Unable to save the study session.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return jsonError("Session id is required.");
    }

    await deleteStudySession(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete session", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Study session not found.", 404);
    }

    return jsonError("Unable to delete the study session.", 500);
  }
}
