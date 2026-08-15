export type LeaderboardRow = {
  userId: string;
  displayName: string;
  wins: number;
  avgGuesses: number;
};

export type RankedLeaderboardRow = LeaderboardRow & { rank: number };

// Ranking is a single swappable function: total wins first, average
// guesses-to-win as the tie-break. Changing the formula later doesn't
// touch the controller or repository.
export function rankLeaderboard(rows: LeaderboardRow[]): RankedLeaderboardRow[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.avgGuesses - b.avgGuesses;
  });

  return sorted.map((row, index) => ({ ...row, rank: index + 1 }));
}

export type LeaderboardRepository = {
  getWinStatsByUser: () => Promise<LeaderboardRow[]>;
};

export function createLeaderboardService(repository: LeaderboardRepository) {
  async function getLeaderboard() {
    const rows = await repository.getWinStatsByUser();
    return rankLeaderboard(rows);
  }

  return { getLeaderboard };
}
