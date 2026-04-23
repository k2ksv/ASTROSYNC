import { z } from "zod";

export const createSessionSchema = z.object({
  duration: z.number().int().positive().max(24 * 60 * 60),
  subject: z.string().trim().min(1).max(80),
  subSubject: z.string().trim().min(1).max(80),
  startedAt: z.string().datetime(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
