import { describe, expect, it } from "vitest";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateWinRate,
} from "../../src/services/streak.service.js";

describe("calculateCurrentStreak", () => {
  it("returns 0 for no results", () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it("counts consecutive wins ending at the latest day", () => {
    const results = [
      { dayIndex: 10, outcome: "win" as const },
      { dayIndex: 9, outcome: "win" as const },
      { dayIndex: 8, outcome: "win" as const },
    ];
    expect(calculateCurrentStreak(results)).toBe(3);
  });

  it("stops at the first loss", () => {
    const results = [
      { dayIndex: 10, outcome: "win" as const },
      { dayIndex: 9, outcome: "loss" as const },
      { dayIndex: 8, outcome: "win" as const },
    ];
    expect(calculateCurrentStreak(results)).toBe(1);
  });

  it("stops at a gap in day index, even if both sides are wins", () => {
    const results = [
      { dayIndex: 10, outcome: "win" as const },
      { dayIndex: 8, outcome: "win" as const },
    ];
    expect(calculateCurrentStreak(results)).toBe(1);
  });

  it("ignores in_progress entries entirely", () => {
    const results = [
      { dayIndex: 10, outcome: "in_progress" as const },
      { dayIndex: 9, outcome: "win" as const },
      { dayIndex: 8, outcome: "win" as const },
    ];
    expect(calculateCurrentStreak(results)).toBe(2);
  });

  it("is 0 if the most recent completed day is a loss", () => {
    const results = [{ dayIndex: 10, outcome: "loss" as const }];
    expect(calculateCurrentStreak(results)).toBe(0);
  });
});

describe("calculateLongestStreak", () => {
  it("returns 0 for no results", () => {
    expect(calculateLongestStreak([])).toBe(0);
  });

  it("finds a historical streak longer than the current one", () => {
    const results = [
      { dayIndex: 1, outcome: "win" as const },
      { dayIndex: 2, outcome: "win" as const },
      { dayIndex: 3, outcome: "win" as const },
      { dayIndex: 4, outcome: "loss" as const },
      { dayIndex: 5, outcome: "loss" as const },
      { dayIndex: 6, outcome: "win" as const },
    ];
    expect(calculateLongestStreak(results)).toBe(3);
  });

  it("does not bridge a gap in day index", () => {
    const results = [
      { dayIndex: 1, outcome: "win" as const },
      { dayIndex: 2, outcome: "win" as const },
      { dayIndex: 5, outcome: "win" as const },
      { dayIndex: 6, outcome: "win" as const },
      { dayIndex: 7, outcome: "win" as const },
    ];
    expect(calculateLongestStreak(results)).toBe(3);
  });
});

describe("calculateWinRate", () => {
  it("returns 0 when there are no completed games", () => {
    expect(calculateWinRate([])).toBe(0);
    expect(
      calculateWinRate([{ dayIndex: 1, outcome: "in_progress" as const }])
    ).toBe(0);
  });

  it("excludes in_progress entries from the denominator", () => {
    const results = [
      { dayIndex: 1, outcome: "win" as const },
      { dayIndex: 2, outcome: "loss" as const },
      { dayIndex: 3, outcome: "in_progress" as const },
    ];
    expect(calculateWinRate(results)).toBe(0.5);
  });
});
