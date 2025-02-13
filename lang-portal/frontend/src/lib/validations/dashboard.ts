import { z } from 'zod';

export const DashboardStatsSchema = z.object({
  study_sessions: z.number().min(0),
  words_learned: z.number().min(0),
  active_groups: z.number().min(0),
  success_rate: z.number().min(0).max(100)
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>; 