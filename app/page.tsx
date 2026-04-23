"use client";

import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { PeriodAnalysis } from "@/components/dashboard/period-analysis";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { SubjectBreakdownPanel } from "@/components/dashboard/subject-breakdown";
import { StopwatchPanel } from "@/components/stopwatch/stopwatch-panel";
import { useStopwatch } from "@/features/sessions/hooks/use-stopwatch";
import { useSessions } from "@/features/sessions/hooks/use-sessions";

export default function HomePage() {
  const stopwatch = useStopwatch();
  const { dashboard, isLoading, isSaving, error, saveSession, deleteSession } = useSessions();
  const liveElapsedSeconds = stopwatch.isRunning ? stopwatch.elapsedSeconds : 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StopwatchPanel
          stopwatch={stopwatch}
          suggestions={dashboard.suggestions}
          onSave={saveSession}
          isSaving={isSaving}
        />
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/6 bg-surface-900/80 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-accent-400">Calm Tracking</p>
              <h1 className="text-3xl font-semibold text-white">ASTRO SYNC</h1>
              <h2 className="text-2xl font-semibold text-white">Designed for deep work, not busy work.</h2>
              <p className="text-sm leading-6 text-surface-400">
                Keep sessions lightweight today, while the structure stays ready for future features
                like friends, activity feeds, and group study spaces.
              </p>
            </div>
          </div>
          <StatsOverview analytics={dashboard.analytics} liveElapsedSeconds={liveElapsedSeconds} />
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-accent-400">Daily Dashboard</p>
          <h2 className="text-2xl font-semibold text-white">Your study sessions by day</h2>
        </div>
        <DashboardPanel
          sessions={dashboard.sessionsByDate}
          isLoading={isLoading}
          onDelete={deleteSession}
        />
      </section>

      <SubjectBreakdownPanel subjects={dashboard.analytics.subjects} />

      <section className="grid gap-6 xl:grid-cols-2">
        <PeriodAnalysis
          eyebrow="Weekly Analysis"
          title="Recent weekly focus trends"
          periods={dashboard.analytics.weekly}
        />
        <PeriodAnalysis
          eyebrow="Monthly Analysis"
          title="Recent monthly focus trends"
          periods={dashboard.analytics.monthly}
        />
      </section>
    </main>
  );
}
