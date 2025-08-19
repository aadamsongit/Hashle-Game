import { useState } from "react";

export const useKeyboard = () => {
  const [isRGBActive, setRGBActive] = useState(false);

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Delete"],
  ];

  const handleKeyboardToggle = () => {
    setRGBActive(!isRGBActive);
  };

  const getGradientClass = (letterIndex) => {
    if (letterIndex <= 8) {
      return "rainbow-bg";
    }
    return "";
  };

  const getRainbowLetterClass = (letterIndex) => {
    if (letterIndex <= 7) {
      return "rainbow-text";
    }
    // Special styling for letter P (index 9) to make it stand out like Delete button
    if (letterIndex === 9) {
      return "special-p";
    }
    return "";
  };

  const getButtonClass = (
    letter,
    keyStatuses,
    darkMode,
    isRGBActive,
    letterIndex
  ) => {
    const buttonClass =
      keyStatuses[letter] === "correct"
        ? "bg-green"
        : keyStatuses[letter] === "present"
        ? "bg-yellow"
        : keyStatuses[letter] === "absent"
        ? "bg-gray"
        : "";

    const gradientClass = isRGBActive ? getGradientClass(letterIndex) : "";
    const darkModeClass = darkMode ? "dark-mode" : "";

    return `min-w-0 shrink text-lg px-2 sm:px-4 py-1 sm:py-2 ${gradientClass} ${buttonClass} ${darkModeClass}`.trim();
  };

  const handleLetterInput = (
    letter,
    guessedWord,
    setGuessedWord,
    currentWord,
    handleDelete,
    handleEnter
  ) => {
    if (letter === "Delete") {
      handleDelete();
    } else if (letter === "Enter") {
      handleEnter();
    } else {
      if (guessedWord.length < currentWord.length) {
        setGuessedWord((prev) => [...prev, letter]);
      }
    }
  };

  return {
    isRGBActive,
    keyboardRows,
    handleKeyboardToggle,
    getGradientClass,
    getRainbowLetterClass,
    getButtonClass,
    handleLetterInput,
  };
};
