import "../openapi/zod-extend.js";
import { z } from "zod";

export const submitResultSchema = z
  .object({
    dayIndex: z.number().int().nonnegative().openapi({ example: 1323 }),
    outcome: z.enum(["win", "loss", "in_progress"]).openapi({ example: "win" }),
    guesses: z.number().int().min(0).max(6).openapi({ example: 4 }),
  })
  .openapi("SubmitResultInput");

export type SubmitResultInput = z.infer<typeof submitResultSchema>;

export const resultResponseSchema = z
  .object({
    id: z.string().uuid().openapi({ example: "830e1ae7-a188-4fba-8179-0cfecae2a105" }),
    userId: z.string().uuid().openapi({ example: "5d9a7b5d-d210-4815-a6d9-feeb03a81253" }),
    dayIndex: z.number().int().nonnegative().openapi({ example: 1323 }),
    outcome: z.enum(["win", "loss", "in_progress"]).openapi({ example: "win" }),
    guesses: z.number().int().min(0).max(6).openapi({ example: 4 }),
    completedAt: z.string().openapi({ example: "2026-08-15T10:22:31.000Z" }),
  })
  .openapi("ResultResponse");
