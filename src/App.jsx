import React from "react";
import { useEffect, useMemo, useReducer } from "react";
import "./index.css";
import data from "./data.json";
import Header from "./components/Header.jsx";
import { useDarkMode } from "./hooks/useDarkMode";
import { useKeyboard } from "./hooks/useKeyboard.jsx";
import { useAnimations } from "./hooks/useAnimations";
import { useGameBoard } from "./hooks/useGameBoard";
import {
  gameReducer,
  createInitialState,
  getDisabledLetters,
} from "./reducer/gameReducer";
import { getDailyWord } from "./utils/getRandomWord";
import { getDayIndex, saveToLocalStorage } from "./utils/gameHelpers";
import {
  isValidWord,
  isValidWordLength,
  isCorrectWord,
} from "./utils/wordHelpers.js";

function App() {
  const [darkMode, handleToggle] = useDarkMode();

  const initialWord = useMemo(() => getDailyWord(data).toUpperCase(), []);
  const [state, dispatch] = useReducer(
    gameReducer,
    initialWord,
    createInitialState
  );
  const {
    currentWord,
    guessedWord,
    allGuesses,
    currentRowIndex,
    gameWon,
    gameLoss,
    hasHydrated,
    classNames,
    keyStatuses,
  } = state;

  const disabledLetters = getDisabledLetters(keyStatuses);

  const {
    isRGBActive,
    keyboardRows,
    handleKeyboardToggle,
    getRainbowLetterClass,
    getButtonClass,
  } = useKeyboard();

  const {
    revealingTiles,
    bounceTiles,
    shakeRowIndex,
    toastMessage,
    handleGuessReveal,
    bounceWinRow,
    triggerShakeEffect,
    showToast,
  } = useAnimations();

  const {
    findEmptyRowIndex,
    getTileClass,
    getGameStatusMessage,
    getGameStatusClass,
  } = useGameBoard();

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const dayIndex = getDayIndex();
    const savedData = JSON.parse(localStorage.getItem("dailyResults") || "{}");
    const todayData = savedData[dayIndex];

    dispatch({
      type: "HYDRATE",
      payload: todayData
        ? { boardState: todayData.boardState, outcome: todayData.outcome }
        : null,
    });
  }, []);

  // Persist board state to localStorage whenever it changes post-hydration.
  useEffect(() => {
    if (!hasHydrated) return;
    const status = gameWon ? "win" : gameLoss ? "loss" : "in_progress";
    saveToLocalStorage(allGuesses, status, getDayIndex());
  }, [allGuesses, hasHydrated, gameWon, gameLoss]);

  // Handle letter input from keyboard
  const guessWord = (letter) => {
    if (gameWon || gameLoss) return;

    if (letter === "Delete") {
      handleDelete();
    } else if (letter === "Enter") {
      handleEnter();
    } else {
      dispatch({ type: "TYPE_LETTER", payload: { letter } });
    }
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_LETTER" });
  };

  const handleEnter = () => {
    const guessedWordStr = guessedWord.join("");

    if (!isValidWordLength(guessedWordStr, currentWord)) {
      triggerShakeEffect(findEmptyRowIndex(allGuesses));
      return;
    }

    const won = isCorrectWord(guessedWordStr, currentWord);
    if (!won && !isValidWord(guessedWordStr, data)) {
      showToast();
      triggerShakeEffect(findEmptyRowIndex(allGuesses));
      return;
    }

    const rowIndex = currentRowIndex;
    const submittedWord = guessedWord;

    dispatch({ type: "SUBMIT_GUESS", payload: { guessedWord: submittedWord } });
    handleGuessReveal(submittedWord, rowIndex);

    if (won) {
      setTimeout(() => {
        setTimeout(() => {
          bounceWinRow(currentWord.split(""), rowIndex);
        }, 1200);
      }, 300);
    }
  };

  const emptyRowIndex = findEmptyRowIndex(allGuesses);

  // Keyboard elements
  const keyboardElements = keyboardRows.map((row, rowIndex) => (
    <div key={rowIndex} className="keyboard-row pb-1">
      {row.map((letter, letterIndex) => {
        const buttonClass = getButtonClass(
          letter,
          keyStatuses,
          darkMode,
          isRGBActive,
          letterIndex
        );

        const rainbowLetter = getRainbowLetterClass(letterIndex);

        const gradientIndex =
          letterIndex <= 7 ? letterIndex : letter === "P" ? 8 : letterIndex;

        return !hasHydrated ? null : (
          <button
            key={letterIndex}
            className={buttonClass}
            onClick={() => guessWord(letter)}
            disabled={disabledLetters.includes(letter)}
            data-delay={gradientIndex}
            aria-label={`Press letter ${letter}`}
            aria-pressed={false}
            type="button"
          >
            <span
              className={isRGBActive ? rainbowLetter : ""}
              data-delay={gradientIndex}
            >
              {letter}
            </span>
          </button>
        );
      })}
    </div>
  ));

  return !hasHydrated ? null : (
    <main className={`sm:pb-10 ${darkMode ? "dark-mode" : ""}`}>
      <Header
        handleToggle={handleToggle}
        toastMessage={toastMessage}
        darkMode={darkMode}
      />

      {/* Game status section */}
      <section aria-label="Game Status">
        <div
          role="status"
          className={`text-center mb-16 ${
            getGameStatusClass(gameWon, gameLoss) || ""
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {getGameStatusMessage(gameWon, gameLoss)}
        </div>
      </section>

      {/* Game board */}
      <div aria-label="Game Board" role="grid" aria-rowcount="6">
        {allGuesses.map((wordRow, index) => (
          <div
            className={`text-center sm:mt-2 ${
              index === shakeRowIndex ? "shake" : ""
            }`}
            key={index}
            role="row"
            aria-rowindex={index + 1}
          >
            {wordRow.map((letter, key) => (
              <span
                key={key}
                className={getTileClass(
                  index,
                  key,
                  classNames,
                  darkMode,
                  revealingTiles,
                  bounceTiles
                )}
                role="gridcell"
                aria-colindex={key + 1}
                aria-label={`Position ${key + 1}, Row ${index + 1}: ${
                  letter || "empty"
                }`}
              >
                {index === currentRowIndex ? guessedWord[key] || "" : letter}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard Section */}
      <section
        className="text-center sm:mt-16 mt-10"
        aria-label="Virtual Keyboard"
        role="group"
      >
        {keyboardElements}
      </section>

      <div className="text-center mt-5">
        <button
          onClick={handleKeyboardToggle}
          aria-label={`Toggle RGB keyboard effects ${
            isRGBActive ? "off" : "on"
          }`}
          aria-pressed={isRGBActive}
          type="button"
        >
          RGB KEYBOARD: TURN {isRGBActive ? "OFF" : "ON"}
        </button>
      </div>
    </main>
  );
}

export default App;
