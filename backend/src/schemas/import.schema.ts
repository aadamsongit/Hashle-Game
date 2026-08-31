import { z } from "zod";
import { getCurrentDayIndex } from "../utils/dayIndex.js";

const importedResultSchema = z.object({
  boardState: z.array(z.array(z.string())),
  outcome: z.enum(["win", "loss", "in_progress"]),
  dayIndex: z
    .number()
    .int()
    .nonnegative()
    .refine((value) => value <= getCurrentDayIndex(), {
      message: "dayIndex cannot be in the future",
    }),
  date: z.string(),
});

export const importSchema = z.object({
  results: z.record(z.string(), importedResultSchema),
});

export type ImportInput = z.infer<typeof importSchema>;
