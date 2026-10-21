import { describe, it, expect } from "vitest";
import {
  gameReducer,
  createInitialState,
  getDisabledLetters,
  MAX_ROWS,
} from "./gameReducer";

describe("createInitialState", () => {
  it("builds an empty board sized to the word length, everything else at defaults", () => {
    const state = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    expect(state.currentWord).toBe("APPLE");
    expect(state.guessedWord).toEqual([]);
    expect(state.allGuesses).toHaveLength(MAX_ROWS);
    expect(state.allGuesses[0]).toEqual(["", "", "", "", ""]);
    expect(state.currentRowIndex).toBe(0);
    expect(state.gameWon).toBe(false);
    expect(state.gameLoss).toBe(false);
  });
});

describe("createInitialState > restoring a saved board", () => {
  it("restores a saved in-progress board, finds the right next row, and computes classNames/keyStatuses", () => {
    const boardState = [
      ["S", "T", "A", "K", "E"],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];

    const next = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: { boardState, outcome: "in_progress" },
    });

    expect(next.currentRowIndex).toBe(1);
    expect(next.gameWon).toBe(false);
    expect(next.gameLoss).toBe(false);
    expect(next.classNames[0]).toBeDefined();
    // "A" lands at position 2 in the guess, but target's only "A" is at
    // position 0, so it's a real (yellow) match, not an exact one.
    expect(next.keyStatuses.A).toBe("present");
    expect(next.keyStatuses.E).toBe("correct");
  });

  it("restores a win outcome correctly", () => {
    const boardState = [
      ["A", "P", "P", "L", "E"],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];

    const next = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: { boardState, outcome: "win" },
    });

    expect(next.gameWon).toBe(true);
    expect(next.gameLoss).toBe(false);
  });

  it("a fully-filled board with no empty rows resolves currentRowIndex to the board length", () => {
    const fullRow = ["S", "T", "A", "K", "E"];
    const boardState = Array.from({ length: MAX_ROWS }, () => [...fullRow]);

    const next = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: { boardState, outcome: "loss" },
    });

    expect(next.currentRowIndex).toBe(MAX_ROWS);
    expect(next.gameLoss).toBe(true);
  });
});

describe("gameReducer > TYPE_LETTER / DELETE_LETTER", () => {
  it("appends a letter", () => {
    const state = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
    };
    const next = gameReducer(state, {
      type: "TYPE_LETTER",
      payload: { letter: "A" },
    });
    expect(next.guessedWord).toEqual(["A"]);
  });

  it("refuses to type past the word length", () => {
    const state = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
      guessedWord: ["A", "P", "P", "L", "E"],
    };
    const next = gameReducer(state, {
      type: "TYPE_LETTER",
      payload: { letter: "X" },
    });
    expect(next.guessedWord).toEqual(["A", "P", "P", "L", "E"]);
    expect(next).toBe(state); // no-op returns the same reference
  });

  it("does nothing once the game is won or lost", () => {
    const won = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
      gameWon: true,
    };
    expect(
      gameReducer(won, { type: "TYPE_LETTER", payload: { letter: "A" } }),
    ).toBe(won);

    const lost = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
      gameLoss: true,
    };
    expect(
      gameReducer(lost, { type: "TYPE_LETTER", payload: { letter: "A" } }),
    ).toBe(lost);
  });

  it("deletes the last letter", () => {
    const state = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
      guessedWord: ["A", "P"],
    };
    const next = gameReducer(state, { type: "DELETE_LETTER" });
    expect(next.guessedWord).toEqual(["A"]);
  });

  it("does nothing when there's nothing to delete", () => {
    const state = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    const next = gameReducer(state, { type: "DELETE_LETTER" });
    expect(next).toBe(state);
  });
});

describe("gameReducer > SUBMIT_GUESS", () => {
  it("places the guess in the current row, advances the row, clears guessedWord", () => {
    const state = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
    };
    const next = gameReducer(state, {
      type: "SUBMIT_GUESS",
      payload: { guessedWord: ["S", "T", "A", "K", "E"] },
    });

    expect(next.allGuesses[0]).toEqual(["S", "T", "A", "K", "E"]);
    expect(next.currentRowIndex).toBe(1);
    expect(next.guessedWord).toEqual([]);
    expect(next.gameWon).toBe(false);
    expect(next.gameLoss).toBe(false);
  });

  it("detects a win", () => {
    const state = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    const next = gameReducer(state, {
      type: "SUBMIT_GUESS",
      payload: { guessedWord: ["A", "P", "P", "L", "E"] },
    });
    expect(next.gameWon).toBe(true);
    expect(next.classNames[0]).toEqual([
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
      "bg-green",
    ]);
  });

  it("detects a loss on the 6th unsuccessful guess", () => {
    let state = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    for (let i = 0; i < 5; i++) {
      state = gameReducer(state, {
        type: "SUBMIT_GUESS",
        payload: { guessedWord: ["S", "T", "A", "K", "E"] },
      });
      expect(state.gameLoss).toBe(false);
    }
    state = gameReducer(state, {
      type: "SUBMIT_GUESS",
      payload: { guessedWord: ["S", "T", "A", "K", "E"] },
    });
    expect(state.currentRowIndex).toBe(6);
    expect(state.gameLoss).toBe(true);
  });

  it("does nothing once the game is already won or lost", () => {
    const won = {
      ...createInitialState({ currentWord: "APPLE", dayIndex: 0, saved: null }),
      gameWon: true,
    };
    expect(
      gameReducer(won, {
        type: "SUBMIT_GUESS",
        payload: { guessedWord: ["S", "T", "A", "K", "E"] },
      }),
    ).toBe(won);
  });

  it("scores a duplicate-letter guess the same way the standalone rebuildStatuses tests already prove correct", () => {
    // Same case as rebuildStatuses.test.js's duplicate-letter case,
    // routed through the reducer this time.
    const state = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    const next = gameReducer(state, {
      type: "SUBMIT_GUESS",
      payload: { guessedWord: ["S", "P", "E", "E", "D"] },
    });
    expect(next.classNames[0]).toEqual([
      "bg-gray",
      "bg-green",
      "bg-yellow",
      "bg-gray",
      "bg-gray",
    ]);
  });
});

describe("gameReducer > purity under double-invocation (React StrictMode)", () => {
  // StrictMode intentionally invokes reducers twice in development,
  // against the SAME original state, specifically to catch reducers
  // that mutate shared references instead of returning new ones. This
  // is the exact bug class that showed up on a different project's
  // useReducer refactor (a shallow copy of an outer array left a
  // nested array shared with the previous state). Guarding against it
  // here directly rather than trusting it won't happen.
  it("calling the reducer twice with the same original state produces the same result and never mutates the original", () => {
    const original = createInitialState({
      currentWord: "APPLE",
      dayIndex: 0,
      saved: null,
    });
    const originalRowZeroRef = original.allGuesses[0];
    const action = {
      type: "SUBMIT_GUESS",
      payload: { guessedWord: ["S", "T", "A", "K", "E"] },
    };

    const resultA = gameReducer(original, action);
    const resultB = gameReducer(original, action);

    expect(resultA).toEqual(resultB);
    // The original state's row must be untouched by either call.
    expect(original.allGuesses[0]).toBe(originalRowZeroRef);
    expect(original.allGuesses[0]).toEqual(["", "", "", "", ""]);
  });

  it("same check for createInitialState against a saved board", () => {
    // StrictMode double-invokes useReducer initializers too.
    const boardState = [
      ["S", "T", "A", "K", "E"],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    const originalBoardRowRef = boardState[0];
    const args = {
      currentWord: "APPLE",
      dayIndex: 0,
      saved: { boardState, outcome: "in_progress" },
    };

    const resultA = createInitialState(args);
    const resultB = createInitialState(args);

    expect(resultA).toEqual(resultB);
    expect(boardState[0]).toBe(originalBoardRowRef);
    expect(boardState[0]).toEqual(["S", "T", "A", "K", "E"]);
  });
});

describe("getDisabledLetters", () => {
  it("returns only the letters marked absent", () => {
    const disabled = getDisabledLetters({
      A: "correct",
      B: "present",
      C: "absent",
      D: "absent",
    });
    expect(disabled.sort()).toEqual(["C", "D"]);
  });

  it("returns an empty array when nothing is absent yet", () => {
    expect(getDisabledLetters({})).toEqual([]);
  });
});
