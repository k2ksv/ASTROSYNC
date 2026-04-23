import type { SessionAnalytics } from "@/features/sessions/types";
import { Card } from "@/components/ui/card";
import { formatDurationHero } from "@/lib/utils";

type StatsOverviewProps = {
  analytics: SessionAnalytics;
  liveElapsedSeconds: number;
};

export function StatsOverview({ analytics, liveElapsedSeconds }: StatsOverviewProps) {
  const totalDuration = analytics.overall.totalDuration + liveElapsedSeconds;
  const totalFocus = formatDurationHero(totalDuration);
  const totalSessions = analytics.overall.totalSessions;
  const activeDays = analytics.overall.activeDays;

  return (
    <div className="grid gap-4">
      <Card className="relative overflow-hidden border-accent-400/20 bg-card-glow p-6 shadow-glow-strong">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-accent-300">Total Focus</p>
              <p className="mt-2 text-sm text-surface-400">
                {liveElapsedSeconds > 0 ? "Live, including this running session" : totalFocus.detail}
              </p>
            </div>
            {liveElapsedSeconds > 0 ? (
              <span className="rounded-full border border-accent-300/30 bg-accent-400/10 px-3 py-1 text-xs font-semibold text-accent-300 shadow-glow">
                Live
              </span>
            ) : null}
          </div>
          <div className="mt-5 text-5xl font-semibold tracking-tight text-white drop-shadow-[0_0_28px_rgba(142,200,164,0.42)] sm:text-6xl">
            {totalFocus.value}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-accent-400/10 p-5 shadow-glow">
          <div className="text-sm text-surface-500">Sessions</div>
          <div className="mt-2 text-3xl font-semibold text-white">{totalSessions}</div>
        </Card>
        <Card className="border-accent-400/10 p-5 shadow-glow">
          <div className="text-sm text-surface-500">Active Days</div>
          <div className="mt-2 text-3xl font-semibold text-white">{activeDays}</div>
        </Card>
      </div>
    </div>
  );
}
