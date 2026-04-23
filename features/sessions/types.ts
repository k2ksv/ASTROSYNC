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
