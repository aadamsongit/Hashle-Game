import "../openapi/zod-extend.js";
import { z } from "zod";

const importedResultSchema = z
  .object({
    boardState: z
      .array(z.array(z.string()))
      .openapi({ example: [["h", "e", "l", "l", "o"], ["", "", "", "", ""]] }),
    outcome: z.enum(["win", "loss", "in_progress"]).openapi({ example: "win" }),
    dayIndex: z.number().int().nonnegative().openapi({ example: 1323 }),
    date: z.string().openapi({ example: "2026-08-15T10:22:31.000Z" }),
  })
  .openapi("ImportedResult");

export const importSchema = z
  .object({
    results: z
      .record(z.string(), importedResultSchema)
      .openapi({
        description:
          "The raw parsed localStorage.dailyResults object, sent as-is.",
      }),
  })
  .openapi("ImportInput");

export type ImportInput = z.infer<typeof importSchema>;

export const importResponseSchema = z
  .object({
    imported: z.number().int().nonnegative().openapi({ example: 2 }),
    skipped: z.number().int().nonnegative().openapi({ example: 1 }),
  })
  .openapi("ImportResponse");
