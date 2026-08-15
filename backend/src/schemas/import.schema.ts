import { z } from "zod";

const importedResultSchema = z.object({
  boardState: z.array(z.array(z.string())),
  outcome: z.enum(["win", "loss", "in_progress"]),
  dayIndex: z.number().int().nonnegative(),
  date: z.string(),
});

export const importSchema = z.object({
  results: z.record(z.string(), importedResultSchema),
});

export type ImportInput = z.infer<typeof importSchema>;
