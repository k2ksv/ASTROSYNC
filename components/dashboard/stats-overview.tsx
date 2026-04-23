import type { SessionAnalytics } from "@/features/sessions/types";
import { Card } from "@/components/ui/card";
import { formatDurationLabel } from "@/lib/utils";

type StatsOverviewProps = {
  analytics: SessionAnalytics;
  liveElapsedSeconds: number;
};

export function StatsOverview({ analytics, liveElapsedSeconds }: StatsOverviewProps) {
  const totalDuration = analytics.overall.totalDuration + liveElapsedSeconds;
  const totalSessions = analytics.overall.totalSessions;
  const activeDays = analytics.overall.activeDays;

  const items = [
    {
      label: "Total Focus",
      value: formatDurationLabel(totalDuration),
      helper: liveElapsedSeconds > 0 ? "Includes current running session" : undefined,
    },
    { label: "Sessions", value: String(totalSessions) },
    { label: "Active Days", value: String(activeDays) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card className="p-5" key={item.label}>
          <div className="text-sm text-surface-500">{item.label}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
          {item.helper ? <div className="mt-1 text-xs text-accent-300">{item.helper}</div> : null}
        </Card>
      ))}
    </div>
  );
}
