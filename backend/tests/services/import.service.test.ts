import { describe, expect, it } from "vitest";
import {
  createImportService,
  type ImportResultRepository,
} from "../../src/services/import.service.js";

function fakeRepository(overrides?: Partial<ImportResultRepository>) {
  const calls: unknown[] = [];
  const repository: ImportResultRepository = {
    countResultsByUserId: async () => 0,
    createManyResults: async (rows) => {
      calls.push(rows);
      return { count: rows.length };
    },
    ...overrides,
  };
  return { repository, calls };
}

describe("import.service", () => {
  it("no-ops when the account already has results", async () => {
    const { repository, calls } = fakeRepository({
      countResultsByUserId: async () => 3,
    });
    const service = createImportService(repository);

    const summary = await service.importResults("user-1", {
      "1": {
        boardState: [["a", "b"]],
        outcome: "win",
        dayIndex: 1,
        date: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(summary).toEqual({ imported: 0, skipped: 1 });
    expect(calls).toHaveLength(0);
  });

  it("skips in_progress entries but imports completed ones", async () => {
    const { repository, calls } = fakeRepository();
    const service = createImportService(repository);

    const summary = await service.importResults("user-1", {
      "1": {
        boardState: [["a"], ["b"]],
        outcome: "win",
        dayIndex: 1,
        date: "2026-01-01T00:00:00.000Z",
      },
      "2": {
        boardState: [["", "", "", "", ""]],
        outcome: "in_progress",
        dayIndex: 2,
        date: "2026-01-02T00:00:00.000Z",
      },
    });

    expect(summary).toEqual({ imported: 1, skipped: 1 });
    expect(calls).toEqual([
      [
        {
          userId: "user-1",
          dayIndex: 1,
          outcome: "win",
          guesses: 2,
          completedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
      ],
    ]);
  });

  it("derives guesses from non-empty rows in boardState", async () => {
    const { repository, calls } = fakeRepository();
    const service = createImportService(repository);

    await service.importResults("user-1", {
      "1": {
        boardState: [
          ["h", "e", "l", "l", "o"],
          ["w", "o", "r", "l", "d"],
          ["", "", "", "", ""],
          ["", "", "", "", ""],
        ],
        outcome: "loss",
        dayIndex: 1,
        date: "2026-01-01T00:00:00.000Z",
      },
    });

    expect((calls[0] as { guesses: number }[])[0].guesses).toBe(2);
  });

  it("returns zero imported when every entry is in_progress", async () => {
    const { repository, calls } = fakeRepository();
    const service = createImportService(repository);

    const summary = await service.importResults("user-1", {
      "1": {
        boardState: [],
        outcome: "in_progress",
        dayIndex: 1,
        date: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(summary).toEqual({ imported: 0, skipped: 1 });
    expect(calls).toHaveLength(0);
  });
});
