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

export function findResultsByUserId(userId: string) {
  return prisma.dailyResult.findMany({
    where: { userId },
    select: { dayIndex: true, outcome: true },
  });
}

export function countResultsByUserId(userId: string) {
  return prisma.dailyResult.count({ where: { userId } });
}

export function createManyResults(
  rows: {
    userId: string;
    dayIndex: number;
    outcome: Outcome;
    guesses: number;
    completedAt: Date;
  }[]
) {
  return prisma.dailyResult.createMany({ data: rows, skipDuplicates: true });
}
