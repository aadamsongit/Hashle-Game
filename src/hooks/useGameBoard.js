export const useGameBoard = () => {
  const findEmptyRowIndex = (allGuesses) => {
    return allGuesses.findIndex((row) =>
      row.every((element) => element === "" || element === "_")
    );
  };

  const getTileClass = (index, key, classNames, darkMode, revealingTiles, bounceTiles) => {
    const baseClass = `tile sm:w-12 sm:h-12 w-6 h-6 border-2 mx-0.5 my-0.5 inline-block align-middle ${
      darkMode ? "border-indigo-300/50" : "border-indigo-500/50"
    }`;

    const colorClass = classNames[index]?.[key] === "bg-green"
      ? "bg-green"
      : classNames[index]?.[key] === "bg-yellow"
      ? "bg-yellow"
      : classNames[index]?.[key] === "bg-gray"
      ? "bg-gray"
      : "";

    const animationClass = `${revealingTiles[`${index}-${key}`] ? "revealing" : ""} ${
      bounceTiles[`${index}-${key}`] ? "bounce" : ""
    }`.trim();

    return `${baseClass} ${colorClass} ${animationClass}`.trim();
  };

  const getGameStatusMessage = (gameWon, gameLoss) => {
    if (gameWon) return "CONGRATULATIONS! YOU WIN!";
    if (gameLoss) return "SORRY! BETTER LUCK NEXT TIME!";
    return null;
  };

  const getGameStatusClass = (gameWon, gameLoss) => {
    if (gameWon) return "game-won";
    if (gameLoss) return "game-lost";
    return null;
  };

  return {
    findEmptyRowIndex,
    getTileClass,
    getGameStatusMessage,
    getGameStatusClass
  };
};
