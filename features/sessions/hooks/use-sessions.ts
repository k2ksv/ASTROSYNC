"use client";

import { useCallback, useEffect, useState } from "react";
import { createSession, fetchSessions, removeSession } from "@/features/sessions/api";
import type { SessionsDashboardData } from "@/features/sessions/types";

const emptyDashboardData: SessionsDashboardData = {
  sessionsByDate: [],
  suggestions: {
    subjects: [],
    subSubjectsBySubject: {},
  },
  analytics: {
    overall: {
      totalDuration: 0,
      totalSessions: 0,
      activeDays: 0,
    },
    subjects: [],
    weekly: [],
    monthly: [],
  },
};

export function useSessions() {
  const [dashboard, setDashboard] = useState<SessionsDashboardData>(emptyDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchSessions();
      setDashboard(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load sessions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const saveSession = useCallback(
    async (payload: {
      duration: number;
      subject: string;
      subSubject: string;
      startedAt: string;
    }) => {
      setIsSaving(true);
      setError(null);

      try {
        await createSession(payload);
        await loadSessions();
      } catch (saveError) {
        const message =
          saveError instanceof Error ? saveError.message : "Unable to save study session.";
        setError(message);
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
    },
    [loadSessions],
  );

  const deleteSession = useCallback(
    async (id: string) => {
      setError(null);

      try {
        await removeSession(id);
        await loadSessions();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error ? deleteError.message : "Unable to delete study session.",
        );
      }
    },
    [loadSessions],
  );

  return {
    dashboard,
    isLoading,
    isSaving,
    error,
    loadSessions,
    saveSession,
    deleteSession,
  };
}
