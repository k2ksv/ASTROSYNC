import { prisma } from "@/lib/prisma";
import type { CreateSessionInput } from "@/features/sessions/validation";
import type {
  SessionAnalytics,
  SessionDayGroup,
  SessionsDashboardData,
  StudySession,
  SubjectBreakdown,
  TimePeriodSummary,
} from "@/features/sessions/types";

function toDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function toSessionRecord(session: {
  id: string;
  duration: number;
  subject: string;
  subSubject: string;
  startedAt: Date;
  completedAt: Date;
  createdAt: Date;
}) {
  return {
    ...session,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
  } satisfies StudySession;
}

function getWeekStart(date: Date) {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setUTCDate(result.getUTCDate() + diff);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function getMonthStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function formatWeekLabel(date: Date) {
  const end = new Date(date);
  end.setUTCDate(end.getUTCDate() + 6);

  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)} - ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(end)}`;
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildPeriodSummaries(
  sessions: Awaited<ReturnType<typeof prisma.studySession.findMany>>,
  type: "weekly" | "monthly",
): TimePeriodSummary[] {
  const groups = new Map<
    string,
    {
      date: Date;
      totalDuration: number;
      sessionCount: number;
      subjectDuration: Map<string, number>;
    }
  >();

  for (const session of sessions) {
    const baseDate = type === "weekly" ? getWeekStart(session.createdAt) : getMonthStart(session.createdAt);
    const key = toDateKey(baseDate);

    const current = groups.get(key) ?? {
      date: baseDate,
      totalDuration: 0,
      sessionCount: 0,
      subjectDuration: new Map<string, number>(),
    };

    current.totalDuration += session.duration;
    current.sessionCount += 1;
    current.subjectDuration.set(
      session.subject,
      (current.subjectDuration.get(session.subject) ?? 0) + session.duration,
    );

    groups.set(key, current);
  }

  return Array.from(groups.entries())
    .sort(([, left], [, right]) => right.date.getTime() - left.date.getTime())
    .slice(0, type === "weekly" ? 8 : 6)
    .map(([key, group]) => {
      const topSubject =
        Array.from(group.subjectDuration.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;

      return {
        key,
        label: type === "weekly" ? formatWeekLabel(group.date) : formatMonthLabel(group.date),
        totalDuration: group.totalDuration,
        sessionCount: group.sessionCount,
        averageSessionDuration:
          group.sessionCount > 0 ? Math.round(group.totalDuration / group.sessionCount) : 0,
        topSubject,
      };
    });
}

function buildSubjectBreakdown(
  sessions: Awaited<ReturnType<typeof prisma.studySession.findMany>>,
): SubjectBreakdown[] {
  const subjects = new Map<
    string,
    {
      totalDuration: number;
      sessionCount: number;
      subSubjects: Map<string, { totalDuration: number; sessionCount: number }>;
    }
  >();

  for (const session of sessions) {
    const current =
      subjects.get(session.subject) ?? {
        totalDuration: 0,
        sessionCount: 0,
        subSubjects: new Map<string, { totalDuration: number; sessionCount: number }>(),
      };

    current.totalDuration += session.duration;
    current.sessionCount += 1;

    const subSubject = current.subSubjects.get(session.subSubject) ?? {
      totalDuration: 0,
      sessionCount: 0,
    };

    subSubject.totalDuration += session.duration;
    subSubject.sessionCount += 1;
    current.subSubjects.set(session.subSubject, subSubject);
    subjects.set(session.subject, current);
  }

  return Array.from(subjects.entries())
    .map(([subject, value]) => ({
      subject,
      totalDuration: value.totalDuration,
      sessionCount: value.sessionCount,
      subSubjects: Array.from(value.subSubjects.entries())
        .map(([subSubject, subValue]) => ({
          subSubject,
          totalDuration: subValue.totalDuration,
          sessionCount: subValue.sessionCount,
        }))
        .sort((left, right) => right.totalDuration - left.totalDuration),
    }))
    .sort((left, right) => right.totalDuration - left.totalDuration);
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

export async function getSessionsDashboardData(): Promise<SessionsDashboardData> {
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
        sessions: [toSessionRecord(session)],
      });

      return accumulator;
    }

    currentGroup.totalDuration += session.duration;
    currentGroup.sessions.push(toSessionRecord(session));

    return accumulator;
  }, new Map());

  const subjectBreakdown = buildSubjectBreakdown(sessions);
  const suggestions = {
    subjects: subjectBreakdown.map((entry) => entry.subject),
    subSubjectsBySubject: subjectBreakdown.reduce<Record<string, string[]>>((accumulator, entry) => {
      accumulator[entry.subject] = entry.subSubjects.map((item) => item.subSubject);
      return accumulator;
    }, {}),
  };

  const analytics: SessionAnalytics = {
    overall: {
      totalDuration: sessions.reduce((sum, session) => sum + session.duration, 0),
      totalSessions: sessions.length,
      activeDays: grouped.size,
    },
    subjects: subjectBreakdown,
    weekly: buildPeriodSummaries(sessions, "weekly"),
    monthly: buildPeriodSummaries(sessions, "monthly"),
  };

  return {
    sessionsByDate: Array.from(grouped.values()),
    suggestions,
    analytics,
  };
}
