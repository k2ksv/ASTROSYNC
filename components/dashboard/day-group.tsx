import { Trash2 } from "lucide-react";
import type { SessionDayGroup } from "@/features/sessions/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateHeading, formatDuration, formatDurationLabel } from "@/lib/utils";

type DayGroupProps = {
  group: SessionDayGroup;
  onDelete: (id: string) => void;
};

export function DayGroup({ group, onDelete }: DayGroupProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-2 border-b border-white/6 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{formatDateHeading(group.date)}</h3>
          <p className="text-sm text-surface-500">{group.sessions.length} sessions logged</p>
        </div>
        <div className="text-sm font-medium text-accent-300">
          Total {formatDurationLabel(group.totalDuration)}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {group.sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/6 bg-surface-800/75 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="text-base font-medium text-white">{session.subject}</div>
              <div className="text-sm text-surface-400">{session.subSubject}</div>
              <div className="text-xs text-surface-500">
                Saved{" "}
                {new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(session.completedAt))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="rounded-full bg-surface-950 px-4 py-2 text-sm font-semibold text-accent-300">
                {formatDuration(session.duration)}
              </div>
              <Button variant="ghost" onClick={() => onDelete(session.id)} aria-label="Delete session">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
