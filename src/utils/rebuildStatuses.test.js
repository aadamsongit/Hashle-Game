import { describe, it, expect } from "vitest";
import { rebuildStatuses } from "./rebuildStatuses";

describe("rebuildStatuses", () => {
  it("marks every letter green when the guess is fully correct", () => {
    const { classNames, keyStatuses } = rebuildStatuses(
      [["a", "p", "p", "l", "e"]],
      "apple"
    );

    expect(classNames[0]).toEqual([
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
    ]);
    expect(keyStatuses).toEqual({
      a: "correct",
      p: "correct",
      l: "correct",
      e: "correct",
    });
  });

  it("marks every letter gray when none of them appear in the word", () => {
    const { classNames, keyStatuses } = rebuildStatuses(
      [["s", "t", "o", "r", "k"]],
      "apple"
    );

    expect(classNames[0]).toEqual([
      "bg-gray",
      "bg-gray",
      "bg-gray",
      "bg-gray",
      "bg-gray",
    ]);
    expect(keyStatuses).toEqual({
      s: "absent",
      t: "absent",
      o: "absent",
      r: "absent",
      k: "absent",
    });
  });

  it("only marks as many duplicate letters yellow as the target word actually has", () => {
    // target "apple" has one "e"; guess "speed" has two — only one should
    // come back yellow, the second must be gray, not a second yellow.
    const { classNames, keyStatuses } = rebuildStatuses(
      [["s", "p", "e", "e", "d"]],
      "apple"
    );

    expect(classNames[0]).toEqual([
      "bg-gray", // s - absent
      "bg-green", // p - correct position
      "bg-yellow", // e - present (first e consumes the budget)
      "bg-gray", // e - budget exhausted, must be gray, not yellow
      "bg-gray", // d - absent
    ]);
    expect(keyStatuses.e).toBe("present");
    expect(keyStatuses.p).toBe("correct");
  });

  it("lets an exact-position match consume the letter budget before the yellow pass runs", () => {
    // target "apple" has two "p"s; guess "puppy" has three. Position 2
    // matches exactly (green) and should use up one of the two "p"
    // budget slots before the remaining "p"s compete for yellow.
    const { classNames } = rebuildStatuses([["p", "u", "p", "p", "y"]], "apple");

    expect(classNames[0][2]).toBe("bg-green"); // exact-position match
    // Of the other two "p"s (index 0 and 3), only one can be yellow —
    // the remaining budget after the green match is 1.
    const otherPResults = [classNames[0][0], classNames[0][3]];
    expect(otherPResults.filter((c) => c === "bg-yellow")).toHaveLength(1);
    expect(otherPResults.filter((c) => c === "bg-gray")).toHaveLength(1);
  });

  it("does not downgrade a key from correct to present on a later guess", () => {
    const { keyStatuses } = rebuildStatuses(
      [
        ["p", "o", "i", "n", "t"], // "p" present, wrong position
        ["a", "p", "p", "l", "e"], // "p" correct in position 1
      ],
      "apple"
    );

    expect(keyStatuses.p).toBe("correct");
  });

  it("does not downgrade a key from present to absent on a later guess", () => {
    const { keyStatuses } = rebuildStatuses(
      [
        ["a", "p", "p", "l", "e"], // "p" correct
        ["s", "t", "o", "r", "y"], // no "p" this row at all
      ],
      "apple"
    );

    // "p" should still read correct after a row that doesn't mention it.
    expect(keyStatuses.p).toBe("correct");
  });

  it("skips fully empty rows without throwing or affecting keyStatuses", () => {
    const { classNames, keyStatuses } = rebuildStatuses(
      [
        ["", "", "", "", ""],
        ["a", "p", "p", "l", "e"],
      ],
      "apple"
    );

    expect(classNames[0]).toBeUndefined();
    expect(classNames[1]).toEqual([
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
    ]);
    expect(keyStatuses).toEqual({
      a: "correct",
      p: "correct",
      l: "correct",
      e: "correct",
    });
  });

  it("normalizes a malformed (non-array) row instead of throwing", () => {
    expect(() =>
      rebuildStatuses([null, ["a", "p", "p", "l", "e"]], "apple")
    ).not.toThrow();
  });
});
