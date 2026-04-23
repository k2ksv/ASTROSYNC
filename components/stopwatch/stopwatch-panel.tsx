"use client";

import { RotateCcw, Pause, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import type { SessionSuggestions } from "@/features/sessions/types";
import type { UseStopwatchReturn } from "@/features/sessions/hooks/use-stopwatch";
import { formatDuration } from "@/lib/utils";

type StopwatchPanelProps = {
  stopwatch: UseStopwatchReturn;
  suggestions: SessionSuggestions;
  onSave: (payload: {
    duration: number;
    subject: string;
    subSubject: string;
    startedAt: string;
  }) => Promise<void>;
  isSaving: boolean;
};

export function StopwatchPanel({ stopwatch, suggestions, onSave, isSaving }: StopwatchPanelProps) {
  const {
    elapsedSeconds,
    isRunning,
    startedAt,
    subject,
    subSubject,
    isHydrated,
    start,
    pause,
    reset,
    clearAll,
    updateField,
  } = stopwatch;

  const trimmedSubject = subject.trim();
  const trimmedSubSubject = subSubject.trim();
  const canSave = elapsedSeconds > 0 && trimmedSubject.length > 0 && trimmedSubSubject.length > 0;

  const availableSubSubjects = suggestions.subSubjectsBySubject[trimmedSubject] ?? [];

  async function handleSave() {
    if (!canSave || !startedAt) {
      return;
    }

    await onSave({
      duration: elapsedSeconds,
      subject: trimmedSubject,
      subSubject: trimmedSubSubject,
      startedAt,
    });

    clearAll();
  }

  return (
    <Card className="overflow-hidden p-6 sm:p-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-accent-400">ASTRO SYNC</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Study with quiet momentum.</h1>
          <p className="max-w-xl text-sm leading-6 text-surface-400">
            Start the timer, stay on one topic, and save each session into a calm daily log.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="subject"
            label="Subject"
            value={subject}
            onChange={(value) => updateField("subject", value)}
            placeholder="Choose or type a subject"
            suggestions={suggestions.subjects}
            helperText="Type a new subject once and it will appear here as a reusable suggestion after you save a session."
            onSuggestionSelect={(value) => updateField("subject", value)}
          />
          <Field
            id="subSubject"
            label="Sub-subject"
            value={subSubject}
            onChange={(value) => updateField("subSubject", value)}
            placeholder="Choose or type a sub-subject"
            suggestions={availableSubSubjects}
            helperText="Sub-subject suggestions adapt to the selected subject from your previous sessions."
            onSuggestionSelect={(value) => updateField("subSubject", value)}
          />
        </div>

        <div className="rounded-[32px] border border-white/6 bg-surface-950/70 px-6 py-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-surface-500">Elapsed Time</div>
          <div className="mt-4 text-5xl font-semibold tracking-[0.18em] text-white sm:text-6xl">
            {isHydrated ? formatDuration(elapsedSeconds) : "00:00:00"}
          </div>
          <div className="mt-3 text-sm text-surface-500">
            {isRunning ? "Session running" : elapsedSeconds > 0 ? "Paused" : "Ready"}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Button onClick={start} disabled={isRunning} className="gap-2">
            <Play size={16} />
            {elapsedSeconds > 0 ? "Resume" : "Start"}
          </Button>
          <Button onClick={pause} disabled={!isRunning} variant="secondary" className="gap-2">
            <Pause size={16} />
            Pause
          </Button>
          <Button onClick={reset} disabled={elapsedSeconds === 0} variant="ghost" className="gap-2">
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button onClick={() => void handleSave()} disabled={!canSave || isSaving} className="gap-2">
            <Save size={16} />
            {isSaving ? "Saving..." : "Stop & Save"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
