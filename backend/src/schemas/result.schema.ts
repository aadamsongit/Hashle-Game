import { z } from "zod";

export const submitResultSchema = z.object({
  dayIndex: z.number().int().nonnegative(),
  outcome: z.enum(["win", "loss", "in_progress"]),
  guesses: z.number().int().min(0).max(6),
});

export type SubmitResultInput = z.infer<typeof submitResultSchema>;
