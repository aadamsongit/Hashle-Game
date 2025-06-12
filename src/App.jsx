import { useState, useEffect } from "react";
import "./index.css";
import data from "./data.json";
import Header from "./components/Header.jsx";
import { getDailyWord } from "./utils/getRandomWord";
import { useDarkMode } from "./hooks/useDarkMode";
import { rebuildStatuses } from "./utils/rebuildStatuses";

function App() {
  // Create states: the default word, a user's guessed word, the array of guesses, index of a guessed word
  const [currentWord, setCurrentWord] = useState("PLACE");
  const [guessedWord, setGuessedWord] = useState([]);
  const [allGuesses, setAllGuesses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dailyResults") || "{}");
      const dayIndex = getDayIndex();
      const todayData = saved[dayIndex];
      if (todayData?.boardState && Array.isArray(todayData.boardState)) {
        return todayData.boardState; // Use saved board if it exists
      }
    } catch (e) {
      console.warn("Failed to load saved boardState", e);
    }
    return []; // Start empty so your useEffect adds rows dynamically
  });

  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  // Create states: index of row for shake effect, toastMessage for conditional rendering of toast
  const [shakeRowIndex, setShakeRowIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState(false);

  // Create states: letterStatuses array to track correct, present, absent, classNames to style CSS class names based on letterStatuses for board
  const [letterStatuses, setLetterStatuses] = useState([]);
  const [classNames, setClassNames] = useState([]);

  // Create states: gameWon and gameLoss for conditional rendering of win/loss messages
  const [gameWon, setGameWon] = useState(false);
  const [gameLoss, setGameLoss] = useState(false);

  // Create state: keyStatuses to style the keyboard keys based on guessed letter styling and disabled letters for letters not in the word
  const [keyStatuses, setKeyStatuses] = useState({});
  const [disabledLetters, setDisabledLetters] = useState([]);

  const [darkMode, handleToggle] = useDarkMode();
  const [revealingTiles, setRevealingTiles] = useState({});
  const [bounceTiles, setBounceTiles] = useState({});

  const [isRGBActive, setRGBActive] = useState(false);

  const [hasHydrated, setHasHydrated] = useState(false);

  // Hold the currentWord when the component mounts to prevent re-rendering of the default word
  // Also normalize the default word with uppercase letters
  useEffect(() => {
    const newWord = getDailyWord(data).toUpperCase();
    setCurrentWord(newWord);

    const dayIndex = getDayIndex();
    const savedData = JSON.parse(localStorage.getItem("dailyResults") || "{}");
    const todayData = savedData[dayIndex];

    // Only update allGuesses if it wasn't initialized from localStorage already
    setAllGuesses((prevAllGuesses) => {
      if (prevAllGuesses.length === 0 && todayData?.boardState) {
        return todayData.boardState;
      }
      return prevAllGuesses;
    });

    // If boardState exists, update other game states accordingly
    if (todayData?.boardState) {
      const lastFilledIndex = todayData.boardState.findIndex((row) =>
        row.every((cell) => cell === "")
      );
      setCurrentRowIndex(
        lastFilledIndex === -1 ? todayData.boardState.length : lastFilledIndex
      );

      // 🧠 Rebuild styles for tiles and keyboard
      const { classNames, keyStatuses } = rebuildStatuses(
        todayData.boardState,
        newWord
      );
      setClassNames(classNames); // ⬅️ Tile backgrounds (green/yellow/gray)
      setKeyStatuses(keyStatuses); // ⬅️ Keyboard key styling

      if (todayData.outcome === "win") {
        setGameWon(true);
      } else if (todayData.outcome === "loss") {
        setGameLoss(true);
      }
    }

    setHasHydrated(true); // ✅ Tell app we're hydrated
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const status = gameWon ? "win" : gameLoss ? "loss" : "in_progress";
    saveToLocalStorage(allGuesses, status, getDayIndex());
  }, [allGuesses, hasHydrated, gameWon, gameLoss]);

  // Convert the word from a string to an array so we can map the letters
  const currentWordArray = currentWord.split("");
  // Create a blank array with the same letter count as the current word
  const wordRow = currentWordArray.map((letter) => "");

  // Function to get the current day index based on the start date
  function getDayIndex() {
    const today = new Date(Date.now()); // Or just: new Date()
    const start = new Date(Date.UTC(2023, 0, 1)); // Match the daily word logic
    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
  // Function to save the board state to localStorage
  function saveToLocalStorage(boardState, outcome, dayIndex) {
    const storedData = JSON.parse(localStorage.getItem("dailyResults")) || {};
    storedData[dayIndex] = {
      boardState,
      outcome,
      dayIndex,
      date: new Date().toISOString(),
    };
    localStorage.setItem("dailyResults", JSON.stringify(storedData));
  }

  // Function for a user to add letters to the board and guess a word

  // Pass in "letter" from the keyboard map
  const guessWord = (letter) => {
    if (gameWon || gameLoss) return;
    // Slice method to delete letters
    if (letter === "Delete" && !gameWon) {
      setGuessedWord((prev) => prev.slice(0, -1));
    } else if (letter === "Enter") {
      //Convert the guessedWord to a string so it can be compared to the currentWord value
      const guessedWordStr = guessedWord.join("");
      // Create a variable to check whether a user's guess is in the word list
      const isValidWord = data
        .map(({ word }) => word.toLowerCase())
        .includes(guessedWordStr.toLowerCase());
      // If the guessed word is too short, trigger a shake effect
      if (guessedWordStr.length !== currentWord.length) {
        triggerShakeEffect();
        // If the user's guessed word matches the current word (default word), trigger the win condition
      } else if (guessedWordStr === currentWord) {
        triggerWin();
        return;
        // If the user guesses a word in the list but it's not the correct word, call the addtoGuessandReset function
      } else if (isValidWord) {
        addtoGuessandReset();
        // If the word is not in the list, show a toast message and also trigger the shake effect
      } else {
        showToast();
        triggerShakeEffect();
      }
    } else {
      // Do not let a user add letters beyond the length of the currentWord
      if (guessedWord.length === currentWord.length) {
        return;
        // If a "letter" isn't Delete or Enter and the length is below currentWord length, set the guessedWord state by adding letters to the array
      } else {
        setGuessedWord((prev) => [...prev, letter]);
      }
    }
  };

  // Function to update the array of guesses (allGuesses)
  const addtoGuessandReset = () => {
    const dayIndex = getDayIndex();
    // Create a shallow copy of guesses to store previous guesses and update the state to add to newGuesses when the function is called
    setAllGuesses((prevGuesses) => {
      if (!hasHydrated) return prevGuesses; // Prevents re-rendering before hydration
      let newGuesses = [...prevGuesses];
      // The guessedWord array is spread with a shallow copy
      const copyOfGuessedWord = [...guessedWord];
      // The guessedWord, as a copy, is added as an array to the array of arrays
      newGuesses[currentRowIndex] = copyOfGuessedWord;

      // Save immediately using the updated guesses, since state isn't updated yet
      saveToLocalStorage(newGuesses, "in_progress", dayIndex);

      return newGuesses;
    });

    // Call the handleGuessReveal function to start the flip animation
    // This will flip the tiles one by one with a delay
    handleGuessReveal(); // start the flip first

    setTimeout(() => {
      // Call addStatusesandClasses to add styling for the guessed letters based on whether they are correct, present, or absent
      addStatusesandClasses(); // THEN apply colors mid-flip
    }, 300);

    if (gameWon || gameLoss) return;

    // Use the state setter to update the row index so that a user will move to the next empty array
    setCurrentRowIndex((prevRowIndex) => {
      return prevRowIndex + 1;
    });

    // Set an empty array so a user can guess a new word
    setGuessedWord([]);
  };

  // Function to create logic for styling letters of guessed words (correct/present/absent)
  const addStatusesandClasses = () => {
    // Create a new array to hold the statuses of each letter in the guessed word
    let newStatuses = Array(guessedWord.length).fill("");
    // Initialize an empty object to keep track of guesses
    let letterCount = {};
    // For/of loop to iterate the currentWord array
    for (const [i, letter] of currentWordArray.entries()) {
      // Increment the letterCount object for each instance of the letter in currentWord
      if (letterCount[letter]) {
        letterCount[letter]++;
      } else {
        // Initialize the letter if it's not already in the object
        letterCount[letter] = 1;
        // Set the letterCount object to 1 if it is the first instance of the letter
      }
      // If the letter in the guessedWord matches the letter in the currentWord at the same index, add "correct" to newStatuses at that index
      // This will ensure that the letter is marked as "correct" only if it is at the same index
      if (guessedWord[i] == currentWordArray[i]) {
        newStatuses[i] = "correct";
        // Now decrement the letterCount object to account for present/absent numbers logic check
        letterCount[letter]--;
      }
    }
    for (const [i, letter] of guessedWord.entries()) {
      if (letterCount[letter] > 0 && newStatuses[i] !== "correct") {
        newStatuses[i] = "present";
        // If the letter is present in the currentWord but not at the same index, add "present" to newStatuses at the index
        // Decrement the letterCount object to account for the present letter
        letterCount[letter]--;
      } else if (newStatuses[i] !== "correct") {
        newStatuses[i] = "absent";
      }
    }

    // Update the letterStatuses state with the new statuses
    // This will trigger a re-render of the component with the new statuses
    setLetterStatuses(newStatuses);
    for (let i = 0; i < guessedWord.length; i++) {
      setTimeout(() => {
        setClassNames((prevClassNames) => {
          let newClassNames = [...prevClassNames];
          let updatedStatuses = [...newStatuses];

          // Update the classNames for the current row based on the letterStatuses
          const status = updatedStatuses[i];

          if (!newClassNames[currentRowIndex]) {
            newClassNames[currentRowIndex] = Array(guessedWord.length).fill("");
          }

          // Apply the classNames based on the status of the letter
          // This will apply the classNames for the current row based on the letterStatuses
          if (status === "correct") {
            newClassNames[currentRowIndex][i] = "bg-green";
          } else if (status === "present") {
            newClassNames[currentRowIndex][i] = "bg-yellow";
          } else if (status === "absent") {
            newClassNames[currentRowIndex][i] = "bg-gray";
          }

          return newClassNames;
        });
      }, i * 300); // Delay each letter's className update by 300ms (so they animate after the flip)
    }

    // loop for logic for keyboard UI styling
    // This styles the keyboard keys (not the board tiles) based on the guessed letters
    // Create a new object to hold the key statuses
    const newKeyStatuses = { ...keyStatuses };
    for (const [i, letter] of guessedWord.entries())
      if (guessedWord[i] === currentWordArray[i]) {
        newKeyStatuses[letter] = "correct";
      } else if (
        currentWordArray.includes(guessedWord[i]) &&
        newKeyStatuses[letter] !== "correct"
      ) {
        newKeyStatuses[letter] = "present";
        //need to add logic for if word is marked as "correct" so "absent" doesn't overwrite
      } else if (
        newKeyStatuses[letter] !== "correct" &&
        newKeyStatuses[letter] !== "present"
      ) {
        newKeyStatuses[letter] = "absent";
        // If the letter is not in the currentWord, mark it as "absent"
        // and update the disabledLetters state to disable the letter on the keyboard
        // This prevents the user from guessing the same letter again
        updateDisabledLetters(letter);
      }
    // Update the keyStatuses state with the new statuses
    setKeyStatuses(newKeyStatuses);
  };

  //set up a win function
  // This function will be called when the user guesses the correct word
  // It will trigger the win animation and update the game state
  const triggerWin = () => {
    handleGuessReveal();

    setTimeout(() => {
      addStatusesandClasses();
      setTimeout(() => {
        bounceWinRow();
      }, 1200);
    }, 300);

    setGameWon(true);

    const updatedGuesses = [...allGuesses];
    updatedGuesses[currentRowIndex] = [...guessedWord];

    if (!hasHydrated) return;

    const dayIndex = getDayIndex(); // ✅ FIXED
    saveToLocalStorage(updatedGuesses, "win", dayIndex);
    setAllGuesses(updatedGuesses);
    setGuessedWord([]); // Clear the guessedWord after winning
  };

  // Function to handle the bounce animation for the winning row
  // This function will apply the bounce animation to each tile in the winning row
  const bounceWinRow = () => {
    // For each letter, stagger bounce AFTER its own flip settles
    currentWordArray.forEach((_, i) => {
      setTimeout(() => {
        setBounceTiles((prev) => ({
          ...prev,
          [`${currentRowIndex}-${i}`]: true,
        }));
      }, i * 100); // 🕒 Start bounce only after its flip + slight delay
    });
  };

  const triggerLoss = () => {
    addStatusesandClasses();
    setGameLoss(true);

    const updatedGuesses = [...allGuesses];
    updatedGuesses[currentRowIndex] = [...guessedWord];

    if (!hasHydrated) return;

    const outcome = "loss";
    const dayIndex = getDayIndex(); // ← you probably missed this line

    saveToLocalStorage(updatedGuesses, outcome, dayIndex);
    setAllGuesses(updatedGuesses); // Optional, but good for state consistency
    setGuessedWord([]); // Clear the guessedWord after losing
  };

  // create a helper function for an array of disabled letters
  const updateDisabledLetters = (letter) => {
    setDisabledLetters((prev) => [...prev, letter]);
  };

  // Effect to trigger the loss condition when the user reaches the maximum number of guesses
  // This effect will check if the currentRowIndex reaches the maximum number of guesses (6)
  useEffect(() => {
    if (currentRowIndex === 6) {
      triggerLoss();
    }
  }, [currentRowIndex]);

  // Handle the guess reveal animation
  // This function will flip the tiles one by one with a delay
  const handleGuessReveal = () => {
    for (let i = 0; i < guessedWord.length; i++) {
      setTimeout(() => {
        setRevealingTiles((prev) => ({
          ...prev,
          // This creates a unique key for each tile based on the current row and index
          // This allows us to apply the revealing class to each tile individually
          [`${currentRowIndex}-${i}`]: true,
        }));
      }, i * 300); // 300ms between flips
    }

    // Add a delay to remove the revealing class after the last tile has flipped
    setTimeout(() => {
      setRevealingTiles({});
    }, guessedWord.length * 300 + 600); // small buffer after final tile
  };

  // Effect to create missing rows based on the current word length
  // This effect will ensure that the number of rows in allGuesses matches the length of the current word
  useEffect(() => {
    if (gameWon || gameLoss) return;

    const desiredRows = currentWord.length + 1; // 6 for a 5-letter word
    const currentRows = allGuesses.length;

    if (currentRows < desiredRows) {
      // Count how many rows are actually empty
      const missingRows = Array(desiredRows - currentRows).fill(
        Array(currentWord.length).fill("")
      );
      setAllGuesses([...allGuesses, ...missingRows]);
    }
  }, [currentWord.length, allGuesses]);

  // Function to handle the keyboard toggle for RGB effect
  // This toggles the RGB effect on the keyboard
  const handleKeyboardToggle = () => {
    setRGBActive(!isRGBActive);
  };

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Delete"],
  ];
  // keyboard elements: nested map to iterate over elements in nested arrays
  const keyboardElements = keyboardRows.map((row, rowIndex) => (
    <div key={rowIndex} className="keyboard-row pb-1">
      {row.map((letter, letterIndex) => {
        // class for letter styling
        const buttonClass =
          keyStatuses[letter] == "correct"
            ? "bg-green"
            : keyStatuses[letter] == "present"
            ? "bg-yellow"
            : keyStatuses[letter] == "absent"
            ? "bg-gray"
            : "";

        const gradientClass =
          letterIndex === 0
            ? "group-0-class"
            : letterIndex === 1
            ? "group-1-class"
            : letterIndex === 2
            ? "group-2-class"
            : letterIndex === 3
            ? "group-3-class"
            : letterIndex === 4
            ? "group-4-class"
            : letterIndex === 5
            ? "group-5-class"
            : letterIndex === 6
            ? "group-6-class"
            : letterIndex === 7
            ? "group-7-class"
            : letterIndex === 8
            ? "group-8-class"
            : letterIndex === 9
            ? "group-9-class"
            : letterIndex === 10
            ? "group-10-class"
            : null;

        const rainbowLetter =
          letterIndex === 0
            ? "letter-0-class"
            : letterIndex === 1
            ? "letter-1-class"
            : letterIndex === 2
            ? "letter-2-class"
            : letterIndex === 3
            ? "letter-3-class"
            : letterIndex === 4
            ? "letter-4-class"
            : letterIndex === 5
            ? "letter-5-class"
            : letterIndex === 6
            ? "letter-6-class"
            : letterIndex === 7
            ? "letter-7-class"
            : letterIndex === 8
            ? "letter-8-class"
            : letterIndex === 9
            ? "letter-9-class"
            : letterIndex === 10
            ? "letter-10-class"
            : null;

        const combinedClass =
          `min-w-0 shrink text-lg px-2 sm:px-4 py-1 sm:py-2 ${
            isRGBActive ? gradientClass : ""
          } ${buttonClass} ${darkMode ? "dark-mode" : ""}`.trim();

        return !hasHydrated ? null : (
          <button
            key={letterIndex}
            className={combinedClass}
            onClick={() => {
              guessWord(letter);
            }}
            disabled={disabledLetters.includes(letter)}
          >
            <span className={isRGBActive ? rainbowLetter : ""}>{letter}</span>
          </button>
        );
      })}
    </div>
  ));

  const emptyRowIndex = allGuesses.findIndex((row) =>
    row.every((element) => element === "" || element === "_")
  );

  const triggerShakeEffect = () => {
    setShakeRowIndex(emptyRowIndex); // Set the row that should shake
    setTimeout(() => {
      setShakeRowIndex(null); // Reset it after 500ms
    }, 600);
  };

  const showToast = () => {
    setToastMessage(true);
    setTimeout(() => {
      setToastMessage(false);
    }, 600);
  };

  return !hasHydrated ? null : (
    <main className={`sm:pb-10 ${darkMode ? "dark-mode" : ""}`}>
      <Header handleToggle={handleToggle} toastMessage={toastMessage} />
      {/* { This section shows toasts for wins or losses based on conditional win/loss logic */}
      <section>
        <h3
          className={`text-center mb-16 ${
            gameWon ? "game-won" : gameLoss ? "game-lost" : null
          }`}
        >
          {gameWon
            ? "CONGRATULATIONS! YOU WIN!"
            : gameLoss
            ? "SORRY! BETTER LUCK NEXT TIME!"
            : null}
        </h3>
      </section>
      {/* Map the board with an array of arrays for guesses */}
      {allGuesses.map((wordRow, index) => (
        <section
          className={`text-center sm:mt-2 ${
            index === shakeRowIndex ? "shake" : ""
          }`}
          key={index}
        >
          {wordRow.map((letter, key) => {
            return (
              <span
                key={key}
                className={`tile sm:w-12 sm:h-12 w-6 h-6 border-2 mx-0.5 my-0.5 inline-block align-middle ${
                  darkMode ? "border-indigo-300/50" : "border-indigo-500/50"
                }
    ${
      classNames[index]?.[key] === "bg-green"
        ? "bg-green"
        : classNames[index]?.[key] === "bg-yellow"
        ? "bg-yellow"
        : classNames[index]?.[key] === "bg-gray"
        ? "bg-gray"
        : ""
    } 
    ${revealingTiles[`${index}-${key}`] ? "revealing" : ""}
    ${bounceTiles[`${index}-${key}`] ? "bounce" : ""}`}
              >
                {guessedWord[key] && index === emptyRowIndex
                  ? guessedWord[key]
                  : letter}
              </span>
            );
          })}
        </section>
      ))}
      {/* Keyboard Section */}
      <section className="text-center sm:mt-16 mt-10">
        {keyboardElements}
      </section>
      <div className="text-center mt-5">
        <button onClick={handleKeyboardToggle}>
          RGB KEYBOARD: TURN {isRGBActive ? "OFF" : "ON"}
        </button>
      </div>
    </main>
  );
}

export default App;
