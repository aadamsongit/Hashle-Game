import { prisma } from "../config/prisma.js";

export async function getWinStatsByUser() {
  const grouped = await prisma.dailyResult.groupBy({
    by: ["userId"],
    where: { outcome: "win" },
    _count: { _all: true },
    _avg: { guesses: true },
  });

  const userIds = grouped.map((g) => g.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, displayName: true },
  });
  const displayNameById = new Map(users.map((u) => [u.id, u.displayName]));

  return grouped.map((g) => ({
    userId: g.userId,
    displayName: displayNameById.get(g.userId) ?? "Unknown",
    wins: g._count._all,
    avgGuesses: g._avg.guesses ?? 0,
  }));
}
