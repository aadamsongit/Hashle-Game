export function rebuildStatuses(guesses, correctWord) {
  let tempClassNames = [];
  let tempKeyStatuses = {};

  // Defensive: normalize guesses to ensure no nulls
  const normalizedGuesses = guesses.map((row) =>
    Array.isArray(row) ? row : ["", "", "", "", ""]
  );

  normalizedGuesses.forEach((guessArray, rowIndex) => {
    if (guessArray.every((letter) => letter === "")) return; // 🚫 skip empty rows

    let rowClassNames = [];
    let correctWordArr = correctWord.split("");
    let letterCount = {};

    correctWordArr.forEach((letter) => {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    // Mark correct letters
    guessArray.forEach((letter, i) => {
      if (letter === correctWordArr[i]) {
        rowClassNames[i] = "bg-green";
        tempKeyStatuses[letter] = "correct";
        letterCount[letter]--;
      }
    });

    // Mark present/absent
    guessArray.forEach((letter, i) => {
      if (rowClassNames[i]) return; // already marked correct

      if (correctWordArr.includes(letter) && letterCount[letter] > 0) {
        rowClassNames[i] = "bg-yellow";
        if (tempKeyStatuses[letter] !== "correct") {
          tempKeyStatuses[letter] = "present";
        }
        letterCount[letter]--;
      } else {
        rowClassNames[i] = "bg-gray";
        if (!tempKeyStatuses[letter]) {
          tempKeyStatuses[letter] = "absent";
        }
      }
    });

    tempClassNames[rowIndex] = rowClassNames;
  });

  return {
    classNames: tempClassNames,
    keyStatuses: tempKeyStatuses,
  };
}
