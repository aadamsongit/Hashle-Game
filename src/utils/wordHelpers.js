export const isValidWord = (guessedWordStr, data) =>
  data
    .map(({ word }) => word.toLowerCase())
    .includes(guessedWordStr.toLowerCase());

export const isValidWordLength = (guessedWordStr, currentWord) =>
  guessedWordStr.length === currentWord.length;

export const isCorrectWord = (guessedWordStr, currentWord) =>
  guessedWordStr === currentWord;
