import { useState, useEffect } from "react";
import { getDailyWord } from "../utils/getRandomWord";
import { getDayIndex, saveToLocalStorage } from "../utils/gameHelpers";
import { rebuildStatuses } from "../utils/rebuildStatuses";

export const useGameState = (data) => {
  const [currentWord, setCurrentWord] = useState("PLACE");
  const [guessedWord, setGuessedWord] = useState([]);
  const [allGuesses, setAllGuesses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dailyResults") || "{}");
      const dayIndex = getDayIndex();
      const todayData = saved[dayIndex];
      if (todayData?.boardState && Array.isArray(todayData.boardState)) {
        return todayData.boardState;
      }
    } catch (e) {
      console.warn("Failed to load saved boardState", e);
    }
    return [];
  });

  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLoss, setGameLoss] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Initialize game state
  useEffect(() => {
    const newWord = getDailyWord(data).toUpperCase();
    console.log(
      `Setting daily word: "${newWord}", Vowels: [${
        newWord.match(/[AEIOUY]/g)?.join(", ") || "NONE"
      }], Length: ${newWord.length}`
    );
    setCurrentWord(newWord);

    const dayIndex = getDayIndex();
    const savedData = JSON.parse(localStorage.getItem("dailyResults") || "{}");
    const todayData = savedData[dayIndex];

    setAllGuesses((prevAllGuesses) => {
      if (prevAllGuesses.length === 0 && todayData?.boardState) {
        return todayData.boardState;
      }
      return prevAllGuesses;
    });

    if (todayData?.boardState) {
      const lastFilledIndex = todayData.boardState.findIndex((row) =>
        row.every((cell) => cell === "")
      );
      setCurrentRowIndex(
        lastFilledIndex === -1 ? todayData.boardState.length : lastFilledIndex
      );

      if (todayData.outcome === "win") {
        setGameWon(true);
      } else if (todayData.outcome === "loss") {
        setGameLoss(true);
      }
    }

    setHasHydrated(true);
  }, [data]);

  // Save game state to localStorage
  useEffect(() => {
    if (!hasHydrated) return;

    const status = gameWon ? "win" : gameLoss ? "loss" : "in_progress";
    saveToLocalStorage(allGuesses, status, getDayIndex());
  }, [allGuesses, hasHydrated, gameWon, gameLoss]);

  // Create missing rows based on word length
  useEffect(() => {
    if (gameWon || gameLoss) return;

    const desiredRows = currentWord.length + 1;
    const currentRows = allGuesses.length;

    if (currentRows < desiredRows) {
      const missingRows = Array(desiredRows - currentRows).fill(
        Array(currentWord.length).fill("")
      );
      setAllGuesses([...allGuesses, ...missingRows]);
    }
  }, [currentWord.length, allGuesses, gameWon, gameLoss]);

  // Check for loss condition
  useEffect(() => {
    if (currentRowIndex === 6) {
      setGameLoss(true);
    }
  }, [currentRowIndex]);

  const resetGuessedWord = () => setGuessedWord([]);
  const addGuess = (guess) => setAllGuesses(prev => [...prev, guess]);
  const updateCurrentRow = (newIndex) => setCurrentRowIndex(newIndex);

  return {
    currentWord,
    guessedWord,
    setGuessedWord,
    allGuesses,
    setAllGuesses,
    currentRowIndex,
    gameWon,
    setGameWon,
    gameLoss,
    setGameLoss,
    hasHydrated,
    resetGuessedWord,
    addGuess,
    updateCurrentRow,
    rebuildStatuses: (boardState, word) => rebuildStatuses(boardState, word)
  };
};
