import type { SessionDayGroup } from "@/features/sessions/types";
import { Card } from "@/components/ui/card";
import { formatDurationLabel } from "@/lib/utils";

type StatsOverviewProps = {
  sessions: SessionDayGroup[];
};

export function StatsOverview({ sessions }: StatsOverviewProps) {
  const totalDuration = sessions.reduce((sum, group) => sum + group.totalDuration, 0);
  const totalSessions = sessions.reduce((sum, group) => sum + group.sessions.length, 0);
  const activeDays = sessions.length;

  const items = [
    { label: "Total Focus", value: formatDurationLabel(totalDuration) },
    { label: "Sessions", value: String(totalSessions) },
    { label: "Active Days", value: String(activeDays) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card className="p-5" key={item.label}>
          <div className="text-sm text-surface-500">{item.label}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
        </Card>
      ))}
    </div>
  );
}
