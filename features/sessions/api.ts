import type { SessionsDashboardData, StudySession } from "@/features/sessions/types";

type GetSessionsResponse = {
  data: SessionsDashboardData;
};

type CreateSessionPayload = {
  duration: number;
  subject: string;
  subSubject: string;
  startedAt: string;
};

type CreateSessionResponse = {
  data: StudySession;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(json.error ?? "Request failed.");
  }

  return json;
}

export async function fetchSessions() {
  const response = await fetch("/api/sessions", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<GetSessionsResponse>(response);
}

export async function createSession(payload: CreateSessionPayload) {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<CreateSessionResponse>(response);
}

export async function removeSession(id: string) {
  const response = await fetch(`/api/sessions?id=${id}`, {
    method: "DELETE",
  });

  return parseResponse<{ success: true }>(response);
}
