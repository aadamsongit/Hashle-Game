import { describe, expect, it } from "vitest";
import { importSchema } from "../../src/schemas/import.schema.js";
import { getCurrentDayIndex } from "../../src/utils/dayIndex.js";

describe("importSchema", () => {
  it("accepts results with a past dayIndex", () => {
    const result = importSchema.safeParse({
      results: {
        "0": {
          boardState: [["a", "b", "c"]],
          outcome: "win",
          dayIndex: getCurrentDayIndex() - 1,
          date: new Date().toISOString(),
        },
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects a result with a future dayIndex", () => {
    const result = importSchema.safeParse({
      results: {
        "0": {
          boardState: [["a", "b", "c"]],
          outcome: "win",
          dayIndex: getCurrentDayIndex() + 5,
          date: new Date().toISOString(),
        },
      },
    });

    expect(result.success).toBe(false);
  });
});
