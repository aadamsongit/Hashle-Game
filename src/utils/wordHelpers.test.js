import data from "../data.json";
import { describe, it, expect } from "vitest";
import { isValidWord, isValidWordLength, isCorrectWord } from "./wordHelpers";

// Optional: check for words without vowels in data (console log for info)
for (const { word } of data) {
  if (!/[aeiouy]/i.test(word)) {
    console.log("No vowels:", word);
  }
}

const mockData = [{ word: "apple" }, { word: "chair" }, { word: "stake" }];

describe("Word Helpers", () => {
  describe("isValidWord", () => {
    it("should return true for a valid word", () => {
      expect(isValidWord("aPPle", mockData)).toBe(true);
    });

    it("should return false for an invalid word", () => {
      expect(isValidWord("banana", mockData)).toBe(false);
    });
  });

  describe("isValidWordLength", () => {
    it("should return true for a word of valid length", () => {
      const currentWord = "apple";
      const guessedWordStr = "chair";
      expect(isValidWordLength(guessedWordStr, currentWord)).toBe(true);
    });

    it("should return false for a word of invalid length", () => {
      const guessedWordStr = "apple";
      const currentWord = "banana";
      expect(isValidWordLength(guessedWordStr, currentWord)).toBe(false);
    });
  });

  describe("isCorrectWord", () => {
    it("should return true for the correct word", () => {
      const guessedWordStr = "apple";
      const currentWord = "apple";
      expect(isCorrectWord(guessedWordStr, currentWord)).toBe(true);
    });

    it("should return false for an incorrect word", () => {
      const guessedWordStr = "apple";
      const currentWord = "chair";
      expect(isCorrectWord(guessedWordStr, currentWord)).toBe(false);
    });
  });
});

describe("Word data validation", () => {
  it("should not contain words without vowels", () => {
    const wordsWithoutVowels = data.filter(
      ({ word }) => !/[aeiouy]/i.test(word)
    );

    if (wordsWithoutVowels.length > 0) {
      throw new Error(
        `Words with no vowels found: ${wordsWithoutVowels
          .map((w) => w.word)
          .join(", ")}`
      );
    }

    expect(wordsWithoutVowels.length).toBe(0);
  });
});
