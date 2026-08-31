import { z } from "zod";
import { getCurrentDayIndex } from "../utils/dayIndex.js";

export const submitResultSchema = z.object({
  dayIndex: z
    .number()
    .int()
    .nonnegative()
    .refine((value) => value <= getCurrentDayIndex(), {
      message: "dayIndex cannot be in the future",
    }),
  outcome: z.enum(["win", "loss", "in_progress"]),
  guesses: z.number().int().min(0).max(6),
});

export type SubmitResultInput = z.infer<typeof submitResultSchema>;
