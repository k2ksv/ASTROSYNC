"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "astro-sync:daily-mission";

type MissionTask = {
  id: string;
  text: string;
  isDone: boolean;
};

type DailyMissionState = {
  note: string;
  tasks: MissionTask[];
};

const defaultMissionState: DailyMissionState = {
  note: "",
  tasks: [],
};

function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readMissionState() {
  if (typeof window === "undefined") {
    return defaultMissionState;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return defaultMissionState;
  }

  try {
    return {
      ...defaultMissionState,
      ...(JSON.parse(rawValue) as DailyMissionState),
    };
  } catch {
    return defaultMissionState;
  }
}

export function DailyMission() {
  const [mission, setMission] = useState<DailyMissionState>(defaultMissionState);
  const [taskText, setTaskText] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setMission(readMissionState());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
  }, [isHydrated, mission]);

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = taskText.trim();

    if (!text) {
      return;
    }

    setMission((currentMission) => ({
      ...currentMission,
      tasks: [
        ...currentMission.tasks,
        {
          id: createTaskId(),
          text,
          isDone: false,
        },
      ],
    }));
    setTaskText("");
  }

  function toggleTask(id: string) {
    setMission((currentMission) => ({
      ...currentMission,
      tasks: currentMission.tasks.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task,
      ),
    }));
  }

  function deleteTask(id: string) {
    setMission((currentMission) => ({
      ...currentMission,
      tasks: currentMission.tasks.filter((task) => task.id !== id),
    }));
  }

  function clearMission() {
    setMission(defaultMissionState);
    setTaskText("");
  }

  const doneCount = mission.tasks.filter((task) => task.isDone).length;

  return (
    <Card className="relative overflow-hidden border-accent-400/20 bg-card-glow p-6 shadow-glow sm:p-8">
      <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-accent-400">Daily Mission</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.08em] text-white">ASTRO SYNC</h1>
          </div>
          {mission.tasks.length > 0 || mission.note ? (
            <Button variant="ghost" onClick={clearMission} className="h-10 px-3" aria-label="Clear mission">
              <X size={16} />
            </Button>
          ) : null}
        </div>

        <textarea
          value={mission.note}
          onChange={(event) =>
            setMission((currentMission) => ({
              ...currentMission,
              note: event.target.value,
            }))
          }
          placeholder="Write today's focus mission..."
          className="min-h-24 w-full resize-none rounded-3xl border border-white/8 bg-surface-950/70 px-4 py-4 text-sm leading-6 text-surface-300 outline-none transition placeholder:text-surface-500 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/15"
        />

        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Add a task..."
            className="min-w-0 flex-1 rounded-2xl border border-white/8 bg-surface-950/70 px-4 py-3 text-sm text-surface-300 outline-none transition placeholder:text-surface-500 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/15"
          />
          <Button type="submit" className="gap-2 px-4">
            <Plus size={16} />
            Add
          </Button>
        </form>

        <div className="space-y-3">
          {mission.tasks.length > 0 ? (
            <div className="flex items-center justify-between text-xs text-surface-500">
              <span>
                {doneCount}/{mission.tasks.length} done
              </span>
              <span>Check off as you study</span>
            </div>
          ) : null}

          {mission.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-2xl border border-white/6 bg-surface-900/70 px-3 py-3"
            >
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                  task.isDone
                    ? "border-accent-400 bg-accent-400 text-surface-950 shadow-glow"
                    : "border-surface-600 text-transparent hover:border-accent-400",
                )}
                aria-label={task.isDone ? "Mark task incomplete" : "Mark task complete"}
              >
                <Check size={14} />
              </button>
              <span
                className={cn(
                  "min-w-0 flex-1 text-sm",
                  task.isDone ? "text-surface-500 line-through" : "text-surface-300",
                )}
              >
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="rounded-full p-2 text-surface-500 transition hover:bg-surface-800 hover:text-red-200"
                aria-label="Delete task"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
