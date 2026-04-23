import type { TimePeriodSummary } from "@/features/sessions/types";
import { Card } from "@/components/ui/card";
import { FocusBarChart } from "@/components/dashboard/focus-bar-chart";
import { formatDurationCompact, formatDurationLabel } from "@/lib/utils";

type PeriodAnalysisProps = {
  title: string;
  eyebrow: string;
  periods: TimePeriodSummary[];
};

export function PeriodAnalysis({ title, eyebrow, periods }: PeriodAnalysisProps) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.24em] text-accent-400">{eyebrow}</p>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      {periods.length === 0 ? (
        <p className="mt-6 text-sm text-surface-500">Not enough sessions yet to build this analysis.</p>
      ) : (
        <div className="mt-6 space-y-5">
          <FocusBarChart periods={periods} />

          <div className="space-y-3">
            {periods.map((period) => (
              <div
                key={period.key}
                className="grid gap-3 rounded-[24px] border border-white/6 bg-surface-800/70 p-4 transition hover:border-accent-400/20 hover:bg-surface-800 md:grid-cols-[1.2fr_0.8fr_0.8fr]"
              >
                <div>
                  <div className="text-base font-semibold text-white">{period.label}</div>
                  <div className="mt-1 text-sm text-surface-500">
                    {period.sessionCount} sessions
                    {period.topSubject ? ` - Top subject: ${period.topSubject}` : ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-surface-500">Total</div>
                  <div className="mt-1 text-sm font-medium text-accent-300">
                    {formatDurationLabel(period.totalDuration)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-surface-500">Avg Session</div>
                  <div className="mt-1 text-sm font-medium text-surface-300">
                    {formatDurationCompact(period.averageSessionDuration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
