export type SessionFormData = {
  subject: string;
  subSubject: string;
};

export type StudySession = {
  id: string;
  duration: number;
  subject: string;
  subSubject: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
};

export type SessionDayGroup = {
  date: string;
  totalDuration: number;
  sessions: StudySession[];
};

export type SubjectBreakdown = {
  subject: string;
  totalDuration: number;
  sessionCount: number;
  subSubjects: {
    subSubject: string;
    totalDuration: number;
    sessionCount: number;
  }[];
};

export type TimePeriodSummary = {
  key: string;
  label: string;
  totalDuration: number;
  sessionCount: number;
  averageSessionDuration: number;
  topSubject: string | null;
};

export type SessionSuggestions = {
  subjects: string[];
  subSubjectsBySubject: Record<string, string[]>;
};

export type SessionAnalytics = {
  overall: {
    totalDuration: number;
    totalSessions: number;
    activeDays: number;
  };
  subjects: SubjectBreakdown[];
  weekly: TimePeriodSummary[];
  monthly: TimePeriodSummary[];
};

export type SessionsDashboardData = {
  sessionsByDate: SessionDayGroup[];
  suggestions: SessionSuggestions;
  analytics: SessionAnalytics;
};
