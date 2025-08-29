import { useState } from "react";
import { getDayIndex, saveToLocalStorage } from "../utils/gameHelpers";
import {
  isValidWord,
  isValidWordLength,
  isCorrectWord,
} from "../utils/wordHelpers";

export const useWordLogic = (data, currentWord, hasHydrated) => {
  const [letterStatuses, setLetterStatuses] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [keyStatuses, setKeyStatuses] = useState({});
  const [disabledLetters, setDisabledLetters] = useState([]);

  const currentWordArray = currentWord.split("");

  const validateAndProcessGuess = (
    guessedWord,
    currentRowIndex,
    allGuesses,
    setAllGuesses,
    setCurrentRowIndex,
    setGuessedWord,
    triggerShakeEffect,
    showToast,
    handleGuessReveal,
    addStatusesandClasses,
    triggerWin
  ) => {
    const guessedWordStr = guessedWord.join("");

    if (!isValidWordLength(guessedWordStr, currentWord)) {
      triggerShakeEffect();
      return false;
    }

    if (isCorrectWord(guessedWordStr, currentWord)) {
      triggerWin();
      return true;
    } else if (isValidWord(guessedWordStr, data)) {
      addtoGuessandReset(
        guessedWord,
        currentRowIndex,
        allGuesses,
        setAllGuesses,
        setCurrentRowIndex,
        setGuessedWord,
        handleGuessReveal,
        addStatusesandClasses
      );
      return true;
    } else {
      showToast();
      triggerShakeEffect();
      return false;
    }
  };

  const addtoGuessandReset = (
    guessedWord,
    currentRowIndex,
    allGuesses,
    setAllGuesses,
    setCurrentRowIndex,
    setGuessedWord,
    handleGuessReveal,
    addStatusesandClasses
  ) => {
    const dayIndex = getDayIndex();

    // Log state before guess
    console.log("Before guess:", {
      guessedWord,
      currentRowIndex,
      allGuesses,
    });

    setAllGuesses((prevGuesses) => {
      if (!hasHydrated) return prevGuesses;
      const newGuesses = [...prevGuesses];
      // Use functional update for row index
      newGuesses[currentRowIndex] = [...guessedWord];
      saveToLocalStorage(newGuesses, "in_progress", dayIndex);
      // Log state after guess
      console.log("After guess:", {
        guessedWord,
        currentRowIndex,
        newGuesses,
      });
      return newGuesses;
    });

    handleGuessReveal();

    setTimeout(() => {
      addStatusesandClasses(guessedWord, currentRowIndex);
    }, 300);

    setCurrentRowIndex((prevRowIndex) => prevRowIndex + 1);
    setGuessedWord([]);
  };

  const addStatusesandClasses = (guessedWord, currentRowIndex) => {
    const vowels = currentWord.match(/[AEIOUY]/g) || [];
    console.log(
      `Current word: "${currentWord}", Vowels found: [${vowels.join(
        ", "
      )}], Word length: ${currentWord.length}`
    );

    let newStatuses = Array(guessedWord.length).fill("");
    let letterCount = {};

    // Count letters in current word
    for (const [i, letter] of currentWordArray.entries()) {
      if (letterCount[letter]) {
        letterCount[letter]++;
      } else {
        letterCount[letter] = 1;
      }
      if (guessedWord[i] === currentWordArray[i]) {
        newStatuses[i] = "correct";
        letterCount[letter]--;
      }
    }

    // Mark present/absent letters
    for (const [i, letter] of guessedWord.entries()) {
      if (letterCount[letter] > 0 && newStatuses[i] !== "correct") {
        newStatuses[i] = "present";
        letterCount[letter]--;
      } else if (newStatuses[i] !== "correct") {
        newStatuses[i] = "absent";
      }
    }

    setLetterStatuses(newStatuses);

    // Update tile colors with animation
    for (let i = 0; i < guessedWord.length; i++) {
      setTimeout(() => {
        setClassNames((prevClassNames) => {
          let newClassNames = [...prevClassNames];
          let updatedStatuses = [...newStatuses];

          const status = updatedStatuses[i];

          if (!newClassNames[currentRowIndex]) {
            newClassNames[currentRowIndex] = Array(guessedWord.length).fill("");
          }

          if (status === "correct") {
            newClassNames[currentRowIndex][i] = "bg-green";
          } else if (status === "present") {
            newClassNames[currentRowIndex][i] = "bg-yellow";
          } else if (status === "absent") {
            newClassNames[currentRowIndex][i] = "bg-gray";
          }

          return newClassNames;
        });
      }, i * 300);
    }

    // Update keyboard styling
    const newKeyStatuses = { ...keyStatuses };
    for (const [i, letter] of guessedWord.entries()) {
      if (guessedWord[i] === currentWordArray[i]) {
        newKeyStatuses[letter] = "correct";
      } else if (
        currentWordArray.includes(guessedWord[i]) &&
        newKeyStatuses[letter] !== "correct"
      ) {
        newKeyStatuses[letter] = "present";
      } else if (
        newKeyStatuses[letter] !== "correct" &&
        newKeyStatuses[letter] !== "present"
      ) {
        newKeyStatuses[letter] = "absent";
        updateDisabledLetters(letter);
      }
    }
    setKeyStatuses(newKeyStatuses);
  };

  const updateDisabledLetters = (letter) => {
    setDisabledLetters((prev) => [...prev, letter]);
  };

  const handleWin = (
    guessedWord,
    currentRowIndex,
    allGuesses,
    setAllGuesses,
    setGuessedWord,
    setGameWon,
    handleGuessReveal,
    addStatusesandClasses,
    bounceWinRow
  ) => {
    handleGuessReveal();

    setTimeout(() => {
      addStatusesandClasses(guessedWord, currentRowIndex);
      setTimeout(() => {
        bounceWinRow();
      }, 1200);
    }, 300);

    setGameWon(true);

    const updatedGuesses = [...allGuesses];
    updatedGuesses[currentRowIndex] = [...guessedWord];

    if (!hasHydrated) return;

    const dayIndex = getDayIndex();
    saveToLocalStorage(updatedGuesses, "win", dayIndex);
    setAllGuesses(updatedGuesses);
    setGuessedWord([]);
  };

  const handleLoss = (
    guessedWord,
    currentRowIndex,
    allGuesses,
    setAllGuesses,
    setGuessedWord,
    setGameLoss
  ) => {
    addStatusesandClasses(guessedWord, currentRowIndex);
    setGameLoss(true);

    const updatedGuesses = [...allGuesses];
    updatedGuesses[currentRowIndex] = [...guessedWord];

    if (!hasHydrated) return;

    const outcome = "loss";
    const dayIndex = getDayIndex();

    saveToLocalStorage(updatedGuesses, outcome, dayIndex);
    setAllGuesses(updatedGuesses);
    setGuessedWord([]);
  };

  return {
    letterStatuses,
    classNames,
    setClassNames,
    keyStatuses,
    setKeyStatuses,
    disabledLetters,
    currentWordArray,
    validateAndProcessGuess,
    addtoGuessandReset,
    addStatusesandClasses,
    updateDisabledLetters,
    handleWin,
    handleLoss,
  };
};
