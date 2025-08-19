import { useState } from "react";

export const useAnimations = () => {
  const [revealingTiles, setRevealingTiles] = useState({});
  const [bounceTiles, setBounceTiles] = useState({});
  const [shakeRowIndex, setShakeRowIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState(false);

  const handleGuessReveal = (guessedWord, currentRowIndex) => {
    for (let i = 0; i < guessedWord.length; i++) {
      setTimeout(() => {
        setRevealingTiles((prev) => ({
          ...prev,
          [`${currentRowIndex}-${i}`]: true,
        }));
      }, i * 300);
    }

    setTimeout(() => {
      setRevealingTiles({});
    }, guessedWord.length * 300 + 600);
  };

  const bounceWinRow = (currentWordArray, currentRowIndex) => {
    currentWordArray.forEach((_, i) => {
      setTimeout(() => {
        setBounceTiles((prev) => ({
          ...prev,
          [`${currentRowIndex}-${i}`]: true,
        }));
      }, i * 100);
    });
  };

  const triggerShakeEffect = (emptyRowIndex) => {
    setShakeRowIndex(emptyRowIndex);
    setTimeout(() => {
      setShakeRowIndex(null);
    }, 600);
  };

  const showToast = () => {
    setToastMessage(true);
    setTimeout(() => {
      setToastMessage(false);
    }, 600);
  };

  return {
    revealingTiles,
    bounceTiles,
    shakeRowIndex,
    toastMessage,
    handleGuessReveal,
    bounceWinRow,
    triggerShakeEffect,
    showToast
  };
};
