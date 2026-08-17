import { describe, expect, it } from "vitest";
import { rankLeaderboard } from "../../src/services/leaderboard.service.js";

describe("rankLeaderboard", () => {
  it("ranks by total wins, descending", () => {
    const ranked = rankLeaderboard([
      { userId: "a", displayName: "A", wins: 3, avgGuesses: 4 },
      { userId: "b", displayName: "B", wins: 5, avgGuesses: 4 },
      { userId: "c", displayName: "C", wins: 1, avgGuesses: 4 },
    ]);

    expect(ranked.map((r) => r.userId)).toEqual(["b", "a", "c"]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("breaks a tie in wins using lower average guesses", () => {
    const ranked = rankLeaderboard([
      { userId: "a", displayName: "A", wins: 5, avgGuesses: 4.5 },
      { userId: "b", displayName: "B", wins: 5, avgGuesses: 3.2 },
    ]);

    expect(ranked.map((r) => r.userId)).toEqual(["b", "a"]);
  });

  it("returns an empty list unchanged", () => {
    expect(rankLeaderboard([])).toEqual([]);
  });
});
