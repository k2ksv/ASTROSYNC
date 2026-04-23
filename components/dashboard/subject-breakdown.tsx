import type { SubjectBreakdown } from "@/features/sessions/types";
import { Card } from "@/components/ui/card";
import { formatDurationCompact, formatDurationLabel } from "@/lib/utils";

type SubjectBreakdownPanelProps = {
  subjects: SubjectBreakdown[];
};

export function SubjectBreakdownPanel({ subjects }: SubjectBreakdownPanelProps) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-[0.24em] text-accent-400">Subject Totals</p>
        <h2 className="text-2xl font-semibold text-white">Focus by subject and sub-subject</h2>
        <p className="text-sm leading-6 text-surface-400">
          Every repeated subject stacks automatically, so two sessions on the same topic show up as one running total here.
        </p>
      </div>

      {subjects.length === 0 ? (
        <p className="mt-6 text-sm text-surface-500">
          Save a few sessions and your subject-wise totals will appear here.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {subjects.map((subject) => (
            <div
              key={subject.subject}
              className="rounded-[24px] border border-white/6 bg-surface-800/70 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{subject.subject}</h3>
                  <p className="mt-1 text-sm text-surface-500">{subject.sessionCount} sessions</p>
                </div>
                <div className="rounded-full bg-surface-950 px-4 py-2 text-sm font-semibold text-accent-300">
                  {formatDurationLabel(subject.totalDuration)}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {subject.subSubjects.map((subSubject) => (
                  <div
                    key={`${subject.subject}-${subSubject.subSubject}`}
                    className="flex items-center justify-between rounded-2xl border border-white/6 bg-surface-900/70 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-surface-300">{subSubject.subSubject}</div>
                      <div className="text-xs text-surface-500">{subSubject.sessionCount} sessions</div>
                    </div>
                    <div className="text-sm text-accent-300">
                      {formatDurationCompact(subSubject.totalDuration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
