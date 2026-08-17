import "../openapi/zod-extend.js";
import { z } from "zod";

export const statsResponseSchema = z
  .object({
    currentStreak: z.number().int().nonnegative().openapi({ example: 2 }),
    longestStreak: z.number().int().nonnegative().openapi({ example: 5 }),
    winRate: z.number().min(0).max(1).openapi({ example: 0.83 }),
  })
  .openapi("StatsResponse");
