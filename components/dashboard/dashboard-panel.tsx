import type { SessionDayGroup } from "@/features/sessions/types";
import { DayGroup } from "@/components/dashboard/day-group";
import { Card } from "@/components/ui/card";

type DashboardPanelProps = {
  sessions: SessionDayGroup[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1].map((item) => (
        <Card className="p-6" key={item}>
          <div className="h-6 w-40 animate-pulse rounded bg-surface-700" />
          <div className="mt-5 space-y-3">
            {[0, 1].map((row) => (
              <div className="h-20 animate-pulse rounded-2xl bg-surface-800" key={row} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DashboardPanel({ sessions, isLoading, onDelete }: DashboardPanelProps) {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Daily Dashboard</h2>
        <p className="mt-3 text-sm leading-6 text-surface-400">
          No study sessions yet. Start the timer, save your first focus block, and your day log will
          appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((group) => (
        <DayGroup group={group} key={group.date} onDelete={onDelete} />
      ))}
    </div>
  );
}
