import { rebuildStatuses } from "../utils/rebuildStatuses";
import { isCorrectWord } from "../utils/wordHelpers";

export const MAX_ROWS = 6;

export type LetterStatus = "correct" | "present" | "absent";
export type KeyStatuses = Record<string, LetterStatus>;
export type TileClass = "bg-green" | "bg-yellow" | "bg-gray";
export type ClassNames = TileClass[][];
export type BoardState = string[][];
export type Outcome = "win" | "loss" | "in_progress";

export interface GameState {
  currentWord: string;
  guessedWord: string[];
  allGuesses: BoardState;
  currentRowIndex: number;
  gameWon: boolean;
  gameLoss: boolean;
  hasHydrated: boolean;
  classNames: ClassNames;
  keyStatuses: KeyStatuses;
}

export type GameAction =
  | {
      type: "HYDRATE";
      payload?: { boardState?: BoardState; outcome?: Outcome } | null;
    }
  | { type: "TYPE_LETTER"; payload: { letter: string } }
  | { type: "DELETE_LETTER" }
  | { type: "SUBMIT_GUESS"; payload: { guessedWord: string[] } };

// rebuildStatuses/isCorrectWord live in plain-JS utils (out of scope for
// this conversion), so their inferred types are looser than what this
// reducer promises its own consumers — the casts below are the seam.
function rebuildStatusesTyped(
  guesses: BoardState,
  correctWord: string
): { classNames: ClassNames; keyStatuses: KeyStatuses } {
  return rebuildStatuses(guesses, correctWord) as {
    classNames: ClassNames;
    keyStatuses: KeyStatuses;
  };
}

export function createInitialState(currentWord: string): GameState {
  return {
    currentWord,
    guessedWord: [],
    allGuesses: Array.from({ length: MAX_ROWS }, () =>
      Array(currentWord.length).fill("")
    ),
    currentRowIndex: 0,
    gameWon: false,
    gameLoss: false,
    hasHydrated: false,
    classNames: [],
    keyStatuses: {},
  };
}

// Guess validity (right length, in the word list) is checked BEFORE
// dispatch, in the component — this reducer only ever receives a guess
// that's already known to be acceptable. It doesn't have access to the
// full word list, so it couldn't validate that itself anyway.
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "HYDRATE": {
      const { boardState, outcome } = action.payload || {};
      const allGuesses =
        boardState && Array.isArray(boardState)
          ? boardState
          : state.allGuesses;

      const currentRowIndex = boardState
        ? resolveNextRowIndex(boardState)
        : state.currentRowIndex;

      const { classNames, keyStatuses } = rebuildStatusesTyped(
        allGuesses,
        state.currentWord
      );

      return {
        ...state,
        allGuesses,
        currentRowIndex,
        gameWon: outcome === "win",
        gameLoss: outcome === "loss",
        hasHydrated: true,
        classNames,
        keyStatuses,
      };
    }

    case "TYPE_LETTER": {
      if (state.gameWon || state.gameLoss) return state;
      if (state.guessedWord.length >= state.currentWord.length) return state;
      return {
        ...state,
        guessedWord: [...state.guessedWord, action.payload.letter],
      };
    }

    case "DELETE_LETTER": {
      if (state.gameWon || state.gameLoss) return state;
      if (state.guessedWord.length === 0) return state;
      return {
        ...state,
        guessedWord: state.guessedWord.slice(0, -1),
      };
    }

    case "SUBMIT_GUESS": {
      if (state.gameWon || state.gameLoss) return state;

      const guessedWord = action.payload.guessedWord;

      // Immutability note (carried over from a real bug on a different
      // project — see docs/reducer-notes.md): never spread only the
      // outer array and then index/mutate a nested one. That leaves the
      // nested array shared by reference with the previous state, which
      // React StrictMode's deliberate double-invocation of reducers in
      // development is specifically designed to expose. Always build a
      // brand-new row array for the row actually being written.
      const allGuesses = state.allGuesses.map((row, index) =>
        index === state.currentRowIndex ? [...guessedWord] : row
      );

      const currentRowIndex = state.currentRowIndex + 1;
      const gameWon = isCorrectWord(guessedWord.join(""), state.currentWord);
      const gameLoss = !gameWon && currentRowIndex >= MAX_ROWS;

      const { classNames, keyStatuses } = rebuildStatusesTyped(
        allGuesses,
        state.currentWord
      );

      return {
        ...state,
        allGuesses,
        guessedWord: [],
        currentRowIndex,
        gameWon,
        gameLoss,
        classNames,
        keyStatuses,
      };
    }

    default:
      return state;
  }
}

function resolveNextRowIndex(boardState: BoardState): number {
  const index = boardState.findIndex((row) => row.some((cell) => cell === ""));
  return index === -1 ? boardState.length : index;
}

// Derived, not stored — a letter is "disabled" purely as a function of
// keyStatuses, so there's no separate piece of state that could ever
// drift out of sync with it.
export function getDisabledLetters(keyStatuses: KeyStatuses): string[] {
  return Object.keys(keyStatuses).filter(
    (letter) => keyStatuses[letter] === "absent"
  );
}
