// the tests are kind of basic and I need to improve them
// but they cover the main functionalities of the word helpers

import { describe, it, expect } from "vitest";
import { isValidWord, isValidWordLength, isCorrectWord } from "./wordHelpers";

const mockData = [{ word: "apple" }, { word: "banana" }, { word: "cherry" }];

describe("Word Helpers", () => {
  describe("isValidWord", () => {
    it("should return true for a valid word", () => {
      expect(isValidWord("apple", mockData)).toBe(true);
    });
  });
  describe("isValidWordLength", () => {
    it("should return true for a word of valid length", () => {
      const currentWord = "apple";
      const guessedWordStr = "apple";
      expect(isValidWordLength(guessedWordStr.length, currentWord)).toBe(true);
    });
  });
  describe("isCorrectWord", () => {
    it("should return true for the correct word", () => {
      const guessedWordStr = "apple";
      const currentWord = "apple";
      expect(isCorrectWord(guessedWordStr, currentWord)).toBe(true);
    });
  });
});
