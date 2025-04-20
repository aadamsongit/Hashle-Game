import { useState, useEffect} from 'react'
import './index.css'
import data from './data.json'

function App() {

  // map over the array of objects and extract the values for the key of "word"
  // pass the value from the key value pair into a variable
  const extractedWords = data.map(element => element.word);

  // function to identify a random word from extractedWords
  const randomArrayWord = () => {
    const randomIndex = Math.floor(Math.random() * extractedWords.length);
    return extractedWords[randomIndex];
  }

  // Create states: the default word, a user's guessed word, the array of guesses, index of a guessed word
  const [currentWord, setCurrentWord] = useState(randomArrayWord(""))
  const [guessedWord, setGuessedWord] = useState([])
  const [allGuesses, setAllGuesses] = useState([])
  const [currentRowIndex, setCurrentRowIndex] = useState(0)

  // Create states: index of row for shake effect, toastMessage for conditional rendering of toast
  const [shakeRowIndex, setShakeRowIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState(false)

  // Create states: letterStatuses array to track correct, present, absent, classNames to style CSS class names based on letterStatuses for board
  const [letterStatuses, setLetterStatuses] = useState([])
  const [classNames, setClassNames] = useState([])

  // Create states: gameWon and gameLoss for conditional rendering of win/loss messages
  const [gameWon, setGameWon] = useState(false)
  const [gameLoss, setGameLoss] = useState(false)

  // Create state: keyStatuses to style the keyboard keys based on guessed letter styling and disabled letters for letters not in the word
  const [keyStatuses, setKeyStatuses] = useState({})
  const [disabledLetters, setDisabledLetters] = useState([])

  const [darkMode, setDarkMode] = useState(false);
  const [revealingTiles, setRevealingTiles] = useState({});
  const [bounceRowIndex, setBounceRowIndex] = useState(null);
  const [bounceTiles, setBounceTiles] = useState({});




  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Store the preference in local storage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Retrieve the preference from local storage on component mount
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode);
    }
  }, []);

  // Hold the currentWord when the component mounts to prevent re-rendering of the default word
  // Also normalize the default word with uppercase letters
  useEffect(() => {
    const newWord = randomArrayWord().toUpperCase(); // normalize here
    console.log("New random word set inside useEffect:", newWord);
    setCurrentWord(newWord);
  }, []);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

 

  // Convert the word from a string to an array so we can map the letters
  const currentWordArray = currentWord.split("")
  // Create a blank array with the same letter count as the current word
  const wordRow = currentWordArray.map((letter) => ('')); 

// Function for a user to add letters to the board and guess a word
// Pass in "letter" from the keyboard map
const guessWord = (letter) => {  
  // Slice method to delete letters
  if (letter === "Delete" && !gameWon) {
    setGuessedWord(prev => prev.slice(0, -1));
  } else if (letter === "Enter") {
    //Convert the guessedWord to a string so it can be compared to the currentWord value
    const guessedWordStr = guessedWord.join('');
    // Create a variable to check whether a user's guess is in the word list
    const isValidWord = extractedWords.map(word => word.toLowerCase()).includes(guessedWordStr.toLowerCase());
    // If the guessed word is too short, trigger a shake effect
    if (guessedWordStr.length !== currentWord.length) {
      triggerShakeEffect();
      // If the user's guessed word matches the current word (default word), trigger the win condition
    } else if (guessedWordStr === currentWord) {
      triggerWin()
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
      null 
      // If a "letter" isn't Delete or Enter and the length is below currentWord length, set the guessedWord state by adding letters to the array
     } else {
      setGuessedWord(prev => [...prev, letter]);
     }
      }
  }

  // Function to update the array of guesses (allGuesses)
const addtoGuessandReset = () => {
  // Create a shallow copy of guesses to store previous guesses and update the state to add to newGuesses when the function is called
  setAllGuesses(prevGuesses => {
    let newGuesses = [...prevGuesses];
    // The guessedWord array is spread with a shallow copy
    const copyOfGuessedWord = [...guessedWord];
    // The guessedWord, as a copy, is added as an array to the array of arrays
     newGuesses[currentRowIndex] = copyOfGuessedWord;
     return newGuesses
    })

  // Call addStatusesandClasses to add styling for the guessed letters based on whether they are correct, present, or absent
  handleGuessReveal(); // start the flip first

  setTimeout(() => {
    addStatusesandClasses(); // THEN apply colors mid-flip
  }, 300); // Match the halfway point of your flip animation
  
  
  // Use the state setter to update the row index so that a user will move to the next empty array
  setCurrentRowIndex(prevRowIndex => {
    return prevRowIndex + 1;
  });

  // Set an empty array so a user can guess a new word
  setGuessedWord([]);
};

// Function to create logic for styling letters of guessed words (correct/present/absent)
const addStatusesandClasses = () => {
  //
  let newStatuses = Array(guessedWord.length).fill("");
  // Initialize an empty object to keep track of guesses
  let letterCount = {}
  // For/of loop to iterate the currentWord array
  for (const [i, letter] of currentWordArray.entries()) {
    // Increment the letterCount object for each instance of the letter in currentWord
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      // Initialize the letter if it's not already in the object
      letterCount[letter] = 1;
      // If the index of a guessed letter equals the index of the letter in the currentWord array, add "correct" to newStatuses at the index
    } if (guessedWord[i] == currentWordArray[i]) {
      newStatuses[i] = "correct"
      // Now decrement the letterCount object to account for present/absent numbers logic check
      letterCount[letter]--;
    }
  }
    for (const [i, letter] of guessedWord.entries()) {
      if (letterCount[letter] > 0 && newStatuses[i] !== "correct")        {
      newStatuses[i] = "present"
      letterCount[letter]--;
    } else if (newStatuses[i] !== "correct") {
      newStatuses[i] = "absent";  
    }
  }
  console.log("New statuses before state update:", newStatuses);
  
  setLetterStatuses(newStatuses)
  for (let i = 0; i < guessedWord.length; i++) {
    setTimeout(() => {
      setClassNames(prevClassNames => {
        let newClassNames = [...prevClassNames];
        let updatedStatuses = [...newStatuses]; // same status array you built
  
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
    }, i * 300); // Delay each letter's className update by 300ms
  }
  

  // loop for logic for keyboard UI styling
  const newKeyStatuses = { ...keyStatuses };
  for (const [i, letter] of guessedWord.entries())
  if (guessedWord[i] === currentWordArray[i]) {
    newKeyStatuses[letter] = "correct"
  } else if (currentWordArray.includes(guessedWord[i]) && newKeyStatuses[letter] !== "correct") {
    newKeyStatuses[letter] = "present"
    //need to add logic for if word is marked as "correct" so "absent" doesn't overwrite
  } else if (newKeyStatuses[letter] !== "correct" && newKeyStatuses[letter] !== "present") {
    newKeyStatuses[letter] = "absent"
    updateDisabledLetters(letter)
  }
  console.log(letterCount)
    console.log("Key statuses:", newKeyStatuses)
    setKeyStatuses(newKeyStatuses)

}

const triggerWin = () => {
  handleGuessReveal(); // Start the flip animation

  // After the flip completes, apply the classes
  setTimeout(() => {
    addStatusesandClasses(); // Apply green/yellow/gray

    // 💡 Delay bounce slightly after styling is fully applied
    setTimeout(() => {
      bounceWinRow(); // <- now starts AFTER color is visible
    }, 1200); // tweak this as needed
  }, 300); // Adjust based on your flip duration

  setGameWon(true);
};

const bounceWinRow = () => {
    // For each letter, stagger bounce AFTER its own flip settles
    currentWordArray.forEach((_, i) => {
      setTimeout(() => {
        setBounceTiles(prev => ({
          ...prev,
          [`${currentRowIndex}-${i}`]: true,
        }));
      }, i * 100); // 🕒 Start bounce only after its flip + slight delay
    });  
}



//set up a loss function
const triggerLoss = () => {
  addStatusesandClasses()
  console.log("triggerLoss function is running");
  setGameLoss(true)
}

// create a helper function for an array of disabled letters
const updateDisabledLetters = (letter) => {
  setDisabledLetters((prev) => [...prev, letter]);
}


useEffect(() => {
  console.log("Updated gameWon state:", gameWon);
}, [gameWon]);

useEffect(() => {
  if (currentRowIndex === 6) {
    triggerLoss()
  }
}, [currentRowIndex]);

const handleGuessReveal = () => {
  const reveals = {};

  for (let i = 0; i < guessedWord.length; i++) {
    setTimeout(() => {
      setRevealingTiles(prev => ({
        ...prev,
        [`${currentRowIndex}-${i}`]: true
      }));
    }, i * 300); // 300ms between flips
  }

  // Optional: clear revealing after the full animation is done
  setTimeout(() => {
    setRevealingTiles({});
  }, guessedWord.length * 300 + 600); // small buffer after final tile
};


useEffect(() => {
  // Add logic to create missing rows
  let missingRows = [];
  for (let i = 0; i < currentWord.length + 1 - allGuesses.length; i++) {
    missingRows.push(wordRow);
  }
  setAllGuesses([...allGuesses, ...missingRows]);
}, [currentWord.length]); // Dependency array to trigger when state changes

const keyboardRows = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["Enter", ..."ZXCVBNM".split(""), "Delete"]
];
    // keyboard elements: nested map to iterate over elements in nested arrays
    const keyboardElements = keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex} className="keyboard-row">{row.map((letter, letterIndex) => {
        // class for letter styling
        const buttonClass = keyStatuses[letter] == "correct" ? "bg-green" : 
        keyStatuses[letter] == "present" ? "bg-yellow" : 
        keyStatuses[letter] == "absent" ? "bg-gray" : ""

        const gradientClass = letterIndex === 0 ? "group-0-class" :
        letterIndex === 1 ? "group-1-class" :
        letterIndex === 2 ? "group-2-class" :
        letterIndex === 3 ? "group-3-class" :
        letterIndex === 4 ? "group-4-class" :
        letterIndex === 5 ? "group-5-class" :
        letterIndex === 6 ? "group-6-class" : 
        letterIndex === 7 ? "group-7-class" :
        letterIndex === 8 ? "group-8-class" :
        letterIndex === 9 ? "group-9-class" :
        letterIndex === 10 ? "group-10-class" : null

        const rainbowLetter = letterIndex === 0 ? "letter-0-class" :
        letterIndex === 1 ? "letter-1-class" :
        letterIndex === 2 ? "letter-2-class" :
        letterIndex === 3 ? "letter-3-class" :
        letterIndex === 4 ? "letter-4-class" :
        letterIndex === 5 ? "letter-5-class" :
        letterIndex === 6 ? "letter-6-class" : 
        letterIndex === 7 ? "letter-7-class" :
        letterIndex === 8 ? "letter-8-class" :
        letterIndex === 9 ? "letter-9-class" :
        letterIndex === 10 ? "letter-10-class" : null

        // going to need to fix this because dark mode is currently overriding the styling of the guessed letters
        const combinedClass = `${gradientClass} ${buttonClass} ${darkMode ? 'dark-mode' : ''}`.trim();

        return (
        <button key={letterIndex} className={combinedClass} onClick={() => {guessWord(letter)}} disabled={disabledLetters.includes(letter)}
><span className={rainbowLetter}>{letter}</span></button>
      );
})}
        </div>
    ));

  console.log(guessedWord)

const emptyRowIndex = allGuesses.findIndex(row => row.every(element => element === "" || element === "_"));
console.log(emptyRowIndex)

const triggerShakeEffect = () => {
  setShakeRowIndex(emptyRowIndex);  // Set the row that should shake
  setTimeout(() => {
    setShakeRowIndex(null);  // Reset it after 500ms
  }, 600);
  console.log("Shake triggered!")
};

const showToast = () => {
  setToastMessage(true);
  setTimeout(() => {
    setToastMessage(false);
  }, 600);
}


  return (
    <main className={`${darkMode ? 'dark-mode' : ''}`}>
    <nav className="flex justify-end items-center p-2">
  <label className="switch">
    <input type="checkbox" onClick={handleToggle} />
    <span className="slider round"></span>
  </label>
</nav>

    {toastMessage && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500">Not in word list!</div>}
    {/* Toast for words not in the list */}
{/* Title For Application*/}
<header className="flex justify-center mt-16 mb-8">
  <div className="w-full max-w-[90%] sm:max-w-[660px]">
    <h1 className="text-3xl font-bold terminal-title">
    🚀Hashle: An Evolving Word Game
    </h1>
  </div>

</header>
{/* { This section shows toasts for wins or losses based on conditional win/loss logic */}
<section><h3 className={`text-center mb-16 ${gameWon ? "game-won" : gameLoss ? "game-lost" : null}`}>{gameWon ? "CONGRATULATIONS! YOU WIN!" : gameLoss ? "SORRY! BETTER LUCK NEXT TIME!" : null}</h3></section>
{/* Map the board with an array of arrays for guesses */}
{allGuesses.map((wordRow, index) => (
  <section 
  className={`text-center mt-2 ${index === shakeRowIndex ? 'shake' : ''}`} 
  key={index}
>
{wordRow.map((letter, key) => {
  return (
<span
  key={key}
  className={`tile w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block align-middle
    ${classNames[index]?.[key] === "bg-green" ? "bg-green" :
    classNames[index]?.[key] === "bg-yellow" ? "bg-yellow" :
    classNames[index]?.[key] === "bg-gray" ? "bg-gray" : ''} 
    ${revealingTiles[`${index}-${key}`] ? "revealing" : ""}
    ${bounceTiles[`${index}-${key}`] ? "bounce" : ""}`}
>
  {guessedWord[key] && index === emptyRowIndex ? guessedWord[key] : letter}
</span>

  );
})}
 </section>
))}
{/* Keyboard Section */}
<section className="text-center mt-16">
                {keyboardElements}
</section>
</main>
  )
}


export default App
