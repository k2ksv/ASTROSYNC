"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultStoredStopwatchState,
  readStoredStopwatchState,
  writeStoredStopwatchState,
} from "@/features/sessions/storage";

type StopwatchState = {
  elapsedSeconds: number;
  isRunning: boolean;
  startedAt: string | null;
  subject: string;
  subSubject: string;
};

export function useStopwatch() {
  const [state, setState] = useState<StopwatchState>(defaultStoredStopwatchState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredStopwatchState();
    setState(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeStoredStopwatchState(state);
  }, [isHydrated, state]);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setState((currentState) => ({
        ...currentState,
        elapsedSeconds: currentState.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [state.isRunning]);

  const actions = useMemo(
    () => ({
      updateField: (field: "subject" | "subSubject", value: string) => {
        setState((currentState) => ({
          ...currentState,
          [field]: value,
        }));
      },
      start: () => {
        setState((currentState) => ({
          ...currentState,
          isRunning: true,
          startedAt: currentState.startedAt ?? new Date().toISOString(),
        }));
      },
      pause: () => {
        setState((currentState) => ({
          ...currentState,
          isRunning: false,
        }));
      },
      reset: () => {
        setState((currentState) => ({
          ...defaultStoredStopwatchState,
          subject: currentState.subject,
          subSubject: currentState.subSubject,
        }));
      },
      clearAll: () => {
        setState(defaultStoredStopwatchState);
      },
    }),
    [],
  );

  return {
    ...state,
    isHydrated,
    ...actions,
  };
}
