import { prisma } from "@/lib/prisma";
import type { CreateSessionInput } from "@/features/sessions/validation";
import type { SessionDayGroup } from "@/features/sessions/types";

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

export async function createStudySession(input: CreateSessionInput) {
  return prisma.studySession.create({
    data: {
      duration: input.duration,
      subject: input.subject.trim(),
      subSubject: input.subSubject.trim(),
      startedAt: new Date(input.startedAt),
    },
  });
}

export async function deleteStudySession(id: string) {
  return prisma.studySession.delete({
    where: { id },
  });
}

export async function getGroupedStudySessions(): Promise<SessionDayGroup[]> {
  const sessions = await prisma.studySession.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const grouped = sessions.reduce<Map<string, SessionDayGroup>>((accumulator, session) => {
    const key = toDateKey(session.createdAt);
    const currentGroup = accumulator.get(key);

    if (!currentGroup) {
      accumulator.set(key, {
        date: key,
        totalDuration: session.duration,
        sessions: [
          {
            ...session,
            startedAt: session.startedAt.toISOString(),
            completedAt: session.completedAt.toISOString(),
            createdAt: session.createdAt.toISOString(),
          },
        ],
      });

      return accumulator;
    }

    currentGroup.totalDuration += session.duration;
    currentGroup.sessions.push({
      ...session,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    });

    return accumulator;
  }, new Map());

  return Array.from(grouped.values());
}
