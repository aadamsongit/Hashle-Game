import "../openapi/zod-extend.js";
import { z } from "zod";

export const leaderboardRowSchema = z
  .object({
    userId: z.string().uuid().openapi({ example: "5d9a7b5d-d210-4815-a6d9-feeb03a81253" }),
    displayName: z.string().openapi({ example: "Bob" }),
    wins: z.number().int().nonnegative().openapi({ example: 12 }),
    avgGuesses: z.number().nonnegative().openapi({ example: 3.5 }),
    rank: z.number().int().positive().openapi({ example: 1 }),
  })
  .openapi("LeaderboardRow");

export const leaderboardResponseSchema = z
  .array(leaderboardRowSchema)
  .openapi("LeaderboardResponse");
