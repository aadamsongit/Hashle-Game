import type { Outcome } from "@prisma/client";

type CompletableResult = { dayIndex: number; outcome: Outcome };

function completedOnly(results: CompletableResult[]) {
  return results.filter((r) => r.outcome === "win" || r.outcome === "loss");
}

export function calculateCurrentStreak(results: CompletableResult[]): number {
  const completed = completedOnly(results).sort(
    (a, b) => b.dayIndex - a.dayIndex
  );

  let streak = 0;
  let expectedDayIndex: number | null = null;

  for (const result of completed) {
    if (expectedDayIndex !== null && result.dayIndex !== expectedDayIndex) {
      break;
    }
    if (result.outcome !== "win") break;

    streak += 1;
    expectedDayIndex = result.dayIndex - 1;
  }

  return streak;
}

export function calculateLongestStreak(results: CompletableResult[]): number {
  const completed = completedOnly(results).sort(
    (a, b) => a.dayIndex - b.dayIndex
  );

  let longest = 0;
  let current = 0;
  let previousDayIndex: number | null = null;

  for (const result of completed) {
    const isConsecutiveDay =
      previousDayIndex !== null && result.dayIndex === previousDayIndex + 1;

    if (result.outcome === "win") {
      current = isConsecutiveDay ? current + 1 : 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }

    previousDayIndex = result.dayIndex;
  }

  return longest;
}

export function calculateWinRate(results: CompletableResult[]): number {
  const completed = completedOnly(results);
  if (completed.length === 0) return 0;

  const wins = completed.filter((r) => r.outcome === "win").length;
  return wins / completed.length;
}
