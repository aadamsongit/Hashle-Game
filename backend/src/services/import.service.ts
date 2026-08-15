import type { Outcome } from "@prisma/client";

export type ImportedResult = {
  boardState: string[][];
  outcome: Outcome;
  dayIndex: number;
  date: string;
};

export type ImportResultRepository = {
  countResultsByUserId: (userId: string) => Promise<number>;
  createManyResults: (
    rows: {
      userId: string;
      dayIndex: number;
      outcome: Outcome;
      guesses: number;
      completedAt: Date;
    }[]
  ) => Promise<{ count: number }>;
};

function countGuesses(boardState: string[][]): number {
  return boardState.filter((row) => row.some((cell) => cell !== "")).length;
}

export function createImportService(resultRepository: ImportResultRepository) {
  async function importResults(
    userId: string,
    results: Record<string, ImportedResult>
  ) {
    const entries = Object.values(results);

    // First-sign-in only: if the account already has any results, this is
    // not the first import, so no-op rather than risk duplicating history.
    const existingCount = await resultRepository.countResultsByUserId(userId);
    if (existingCount > 0) {
      return { imported: 0, skipped: entries.length };
    }

    const completed = entries.filter((r) => r.outcome !== "in_progress");
    const skipped = entries.length - completed.length;

    if (completed.length === 0) {
      return { imported: 0, skipped };
    }

    const rows = completed.map((r) => ({
      userId,
      dayIndex: r.dayIndex,
      outcome: r.outcome,
      guesses: countGuesses(r.boardState),
      completedAt: new Date(r.date),
    }));

    const { count } = await resultRepository.createManyResults(rows);
    return { imported: count, skipped };
  }

  return { importResults };
}
