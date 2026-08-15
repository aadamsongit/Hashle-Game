import type { Outcome } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export function upsertResult(data: {
  userId: string;
  dayIndex: number;
  outcome: Outcome;
  guesses: number;
}) {
  return prisma.dailyResult.upsert({
    where: {
      userId_dayIndex: { userId: data.userId, dayIndex: data.dayIndex },
    },
    update: {
      outcome: data.outcome,
      guesses: data.guesses,
      completedAt: new Date(),
    },
    create: data,
  });
}
