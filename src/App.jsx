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
const guessWord = (letter) => {
      // Pass in "letter" from the keyboard map
  if (letter === "Delete" && !gameWon) {
    setGuessedWord(prev => prev.slice(0, -1));
    // Slice method to delete letters
  } else if (letter === "Enter") {
    const guessedWordStr = guessedWord.join('');
    const isValidWord = extractedWords.map(word => word.toLowerCase()).includes(guessedWordStr.toLowerCase());
    console.log(`Checking win condition...`);
    console.log(`guessedWord: "${guessedWord}" | currentWord: "${currentWord}"`);
    if (guessedWordStr.length !== currentWord.length) {
      triggerShakeEffect();
      // If the guessed word is too short, trigger a shake effect
    } else if (guessedWordStr === currentWord) {
      console.log(`Winning condition met! guessedWord: ${guessedWordStr}, currentWord: ${currentWord}`);
      triggerWin()
    } else if (isValidWord) {
      addtoGuessandReset();
    } else {
      showToast();
      triggerShakeEffect();
      console.log("Null");
    }
  } else {
    if (guessedWord.length === currentWord.length) {
      null 
     } else {
      setGuessedWord(prev => [...prev, letter]);
     }
      }
  }

  // Function to add the guess to the array of guesses, update the row index, and initialize a new array for a new guess
const addtoGuessandReset = () => {
  setAllGuesses(prevGuesses => {
    let newGuesses = [...prevGuesses];
    const copyOfGuessedWord = [...guessedWord];
     newGuesses[currentRowIndex] = copyOfGuessedWord;
     return newGuesses
    })

  addStatusesandClasses()
  
  console.log("Row index before update:", currentRowIndex);
  setCurrentRowIndex(prevRowIndex => {
    console.log("Row index after update:", prevRowIndex + 1);
    return prevRowIndex + 1;
  });

  console.log("Before clearing guessedWord:", guessedWord);
  setGuessedWord([]);
  console.log("After clearing guessedWord:", guessedWord); // This won't reflect immediately
};


const addStatusesandClasses = () => {
  let newStatuses = [...letterStatuses]; // Copy the existing state
  let letterCount = {}
  for (const [i, letter] of currentWordArray.entries()) {
    console.log(`Checking guessedWord[${i}]: ${guessedWord[i]} == currentWordArray[${i}]: ${currentWordArray[i]}`);
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      letterCount[letter] = 1;
      console.log("Guessed letter for correct:", guessedWord[i])
      console.log("Array index to compare for text:", currentWordArray[i])
    } if (guessedWord[i] == currentWordArray[i]) {
      newStatuses[i] = "correct"
      console.log("Check if correct exists:", newStatuses[i])
      letterCount[letter]--;
      console.log("Letter count after processing currentWord:", letterCount);
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
  setClassNames(prevClassNames => {
    let newClassNames = [...prevClassNames];
    let updatedStatuses = [...newStatuses];
    newClassNames[currentRowIndex] = updatedStatuses
    console.log("Updated row classes:", newClassNames[currentRowIndex]);
    console.log("Letter Statuses before update:", updatedStatuses)

    for (let i = 0; i < guessedWord.length; i++) {
      if (updatedStatuses[i] == "correct") {
        newClassNames[currentRowIndex][i]  = "bg-green"
      }
      else if (updatedStatuses[i] == "present") {
        newClassNames[currentRowIndex][i]  = "bg-yellow"
      } else if (updatedStatuses[i] == "absent") {
        newClassNames[currentRowIndex][i]  = "bg-gray"
      }
    }
    console.log("ClassNames after update:", newClassNames);
    return newClassNames
    
  })

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

//set up a win function
const triggerWin = () => {
  addStatusesandClasses()
  console.log("triggerWin function is running");
  setGameWon(true)
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

        // console.log("Index of letters:", letterIndex)
        // console.log("Letter:", letter)

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
{/* Title For Application Goes Here */}
<header className="flex justify-center mt-16 mb-8">
  <div className="w-full max-w-[90%] sm:max-w-[660px]">
    <h1 className="text-3xl font-bold terminal-title">
    🚀Hashle: An Evolving Word Game
    </h1>
  </div>

</header>
{/* Guess Counter (Attempts Left) - Build Out This Section*/}
<section><h3 className={`text-center mb-16 ${gameWon ? "game-won" : gameLoss ? "game-lost" : null}`}>{gameWon ? "CONGRATULATIONS! YOU WIN!" : gameLoss ? "SORRY! BETTER LUCK NEXT TIME!" : null}</h3></section>
{/* Message Section */}
{/* Word Input Field -- Build Out Here */}
{allGuesses.map((wordRow, index) => (
  <section 
  className={`text-center mt-2 ${index === shakeRowIndex ? 'shake' : ''}`} 
  key={index}
>
{wordRow.map((letter, key) => {
  return (
    <span key={key} className={`w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block align-middle
      ${classNames[index]?.[key] === "bg-green" ? "bg-green" :
      classNames[index]?.[key] === "bg-yellow" ? "bg-yellow" :
      classNames[index]?.[key] === "bg-gray" ? "bg-gray" : ''}`}>
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
