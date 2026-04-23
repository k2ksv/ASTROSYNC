const STORAGE_KEY = "astro-sync:stopwatch";

export type StoredStopwatchState = {
  elapsedSeconds: number;
  isRunning: boolean;
  startedAt: string | null;
  subject: string;
  subSubject: string;
};

export const defaultStoredStopwatchState: StoredStopwatchState = {
  elapsedSeconds: 0,
  isRunning: false,
  startedAt: null,
  subject: "",
  subSubject: "",
};

export function readStoredStopwatchState(): StoredStopwatchState {
  if (typeof window === "undefined") {
    return defaultStoredStopwatchState;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return defaultStoredStopwatchState;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredStopwatchState;

    return {
      ...defaultStoredStopwatchState,
      ...parsed,
    };
  } catch {
    return defaultStoredStopwatchState;
  }
}

export function writeStoredStopwatchState(value: StoredStopwatchState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}
