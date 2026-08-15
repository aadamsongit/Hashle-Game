import type { Outcome } from "@prisma/client";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateWinRate,
} from "./streak.service.js";

export type StatsResultRepository = {
  findResultsByUserId: (
    userId: string
  ) => Promise<{ dayIndex: number; outcome: Outcome }[]>;
};

export function createStatsService(resultRepository: StatsResultRepository) {
  async function getStatsForUser(userId: string) {
    const results = await resultRepository.findResultsByUserId(userId);

    return {
      currentStreak: calculateCurrentStreak(results),
      longestStreak: calculateLongestStreak(results),
      winRate: calculateWinRate(results),
    };
  }

  return { getStatsForUser };
}
