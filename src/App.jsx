import { useState, useEffect } from "react";
import "./index.css";
import data from "./data.json";
import Header from "./components/Header.jsx";
import { useDarkMode } from "./hooks/useDarkMode";
import { useGameState } from "./hooks/useGameState";
import { useWordLogic } from "./hooks/useWordLogic";
import { useKeyboard } from "./hooks/useKeyboard";
import { useAnimations } from "./hooks/useAnimations";
import { useGameBoard } from "./hooks/useGameBoard";
import { rebuildStatuses } from "./utils/rebuildStatuses";

function App() {
  const [darkMode, handleToggle] = useDarkMode();

  const {
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
    updateCurrentRow,
  } = useGameState(data);

  const {
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
    handleWin,
    handleLoss,
  } = useWordLogic(data, currentWord, hasHydrated);

  const {
    isRGBActive,
    keyboardRows,
    handleKeyboardToggle,
    getRainbowLetterClass,
    getButtonClass,
    handleLetterInput,
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

  // Handle letter input from keyboard
  const guessWord = (letter) => {
    if (gameWon || gameLoss) return;

    handleLetterInput(
      letter,
      guessedWord,
      setGuessedWord,
      currentWord,
      handleDelete,
      handleEnter
    );
  };

  const handleDelete = () => {
    setGuessedWord((prev) => prev.slice(0, -1));
  };

  const handleEnter = () => {
    const success = validateAndProcessGuess(
      guessedWord,
      currentRowIndex,
      allGuesses,
      setAllGuesses,
      updateCurrentRow,
      setGuessedWord,
      () => triggerShakeEffect(findEmptyRowIndex(allGuesses)),
      showToast,
      () => handleGuessReveal(guessedWord, currentRowIndex),
      () => addStatusesandClasses(guessedWord, currentRowIndex),
      () => triggerWin()
    );

    if (success) {
      addtoGuessandReset(
        guessedWord,
        currentRowIndex,
        allGuesses,
        setAllGuesses,
        updateCurrentRow,
        setGuessedWord,
        () => handleGuessReveal(guessedWord, currentRowIndex),
        () => addStatusesandClasses(guessedWord, currentRowIndex)
      );
    }
  };

  const triggerWin = () => {
    handleGuessReveal(guessedWord, currentRowIndex);

    setTimeout(() => {
      addStatusesandClasses(guessedWord, currentRowIndex);
      setTimeout(() => {
        bounceWinRow(currentWordArray, currentRowIndex);
      }, 1200);
    }, 300);

    handleWin(
      guessedWord,
      currentRowIndex,
      allGuesses,
      setAllGuesses,
      setGuessedWord,
      setGameWon,
      () => handleGuessReveal(guessedWord, currentRowIndex),
      () => addStatusesandClasses(guessedWord, currentRowIndex),
      () => bounceWinRow(currentWordArray, currentRowIndex)
    );
  };

  // Effect to trigger loss when max guesses reached
  useEffect(() => {
    if (currentRowIndex === 6) {
      handleLoss(
        guessedWord,
        currentRowIndex,
        allGuesses,
        setAllGuesses,
        setGuessedWord,
        setGameLoss
      );
    }
  }, [
    currentRowIndex,
    guessedWord,
    allGuesses,
    setAllGuesses,
    setGuessedWord,
    setGameLoss,
  ]);

  // Effect to rebuild statuses when game state changes
  useEffect(() => {
    if (hasHydrated && allGuesses.length > 0) {
      const { classNames: newClassNames, keyStatuses: newKeyStatuses } =
        rebuildStatuses(allGuesses, currentWord);
      setClassNames(newClassNames);
      setKeyStatuses(newKeyStatuses);
    }
  }, [hasHydrated, allGuesses, currentWord, setClassNames, setKeyStatuses]);

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

        return !hasHydrated ? null : (
          <button
            key={letterIndex}
            className={buttonClass}
            onClick={() => guessWord(letter)}
            disabled={disabledLetters.includes(letter)}
            data-delay={letterIndex <= 8 ? letterIndex : ""}
            aria-label={`Press letter ${letter}`}
            aria-pressed={false}
            type="button"
          >
            <span
              className={isRGBActive ? rainbowLetter : ""}
              data-delay={letterIndex <= 7 ? letterIndex : ""}
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
        <h2
          className={`text-center mb-16 ${getGameStatusClass(
            gameWon,
            gameLoss
          )}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {getGameStatusMessage(gameWon, gameLoss)}
        </h2>
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
                {guessedWord[key] && index === emptyRowIndex
                  ? guessedWord[key]
                  : letter}
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
