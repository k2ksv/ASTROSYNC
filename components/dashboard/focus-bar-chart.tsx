import type { TimePeriodSummary } from "@/features/sessions/types";
import { formatDurationCompact } from "@/lib/utils";

type FocusBarChartProps = {
  periods: TimePeriodSummary[];
};

export function FocusBarChart({ periods }: FocusBarChartProps) {
  const chartPeriods = [...periods].reverse();
  const maxDuration = Math.max(...chartPeriods.map((period) => period.totalDuration), 1);

  return (
    <div className="rounded-[28px] border border-accent-400/10 bg-surface-950/70 p-4 shadow-glow">
      <div className="flex h-48 items-end gap-3 sm:gap-4">
        {chartPeriods.map((period) => {
          const height = Math.max((period.totalDuration / maxDuration) * 100, 8);

          return (
            <div key={period.key} className="flex min-w-0 flex-1 flex-col items-center gap-3">
              <div className="flex h-36 w-full items-end rounded-full bg-surface-900/80 p-1.5">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-accent-500 via-accent-400 to-accent-300 shadow-glow-strong transition-all duration-500"
                  style={{ height: `${height}%` }}
                  title={`${period.label}: ${formatDurationCompact(period.totalDuration)}`}
                />
              </div>
              <div className="max-w-full truncate text-center text-[11px] text-surface-500">
                {period.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-surface-500">
        <span>Older</span>
        <span>Total focus time</span>
        <span>Recent</span>
      </div>
    </div>
  );
}
