import { useState, useEffect} from 'react'
import './index.css'
import data from './data.json'

function App() {

  const extractedWords = data.map(element => element.word);
  console.log(extractedWords)

  const randomArrayWord = () => {
    const randomIndex = Math.floor(Math.random() * extractedWords.length);
    return extractedWords[randomIndex];
  }

  // Create a state for the word the user guesses
  const [currentWord, setCurrentWord] = useState(randomArrayWord(""))
  // Create another state for the word the user guesses
  const [guessedWord, setGuessedWord] = useState([])
  // Create a state for all guesses (an array of arrays)
  const [allGuesses, setAllGuesses] = useState([])
  // Create a state variable for the index of a guessed word
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  // Create a state variable for the UI to shake when a word is invalid
  const [shakeRowIndex, setShakeRowIndex] = useState(null);
  // Create a state variable for the toast
  const [toastMessage, setToastMessage] = useState(false)
  // Create a state variable to compare guessed letters to those of the held word
  const [letterStatuses, setLetterStatuses] = useState([])
  // Create a state array for the class names
  const [classNames, setClassNames] = useState([])
  // Create a state for a win message
  const [gameWon, setGameWon] = useState(false)
  // Create another state for a loss message
  const [gameLoss, setGameLoss] = useState(false)

  //useEffect hook to prevent infinite re-renderings of the currentWord value
  useEffect(() => {
    const newWord = randomArrayWord().toUpperCase(); // normalize here
    console.log("New random word set inside useEffect:", newWord);
    setCurrentWord(newWord);
  }, []);
  
  // Track when currentWord is updated
// useEffect(() => {
//   console.log("currentWord updated to:", currentWord);
// }, [currentWord]);
// // Check if currentWord is correct after it's set  
  
 

  // Convert the word from a string to an array so we can map the letters
  const currentWordArray = currentWord.split("")
  // Create a blank array with the same letter count as the current word
  const wordRow = currentWordArray.map((letter) => ('')); 

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Delete"]
  ];


// Create a function to hold the guessed letters in state
const guessWord = (letter) => {
      // Convert to lowercase for comparison
  if (letter === "Delete" && !gameWon) {
    setGuessedWord(prev => prev.slice(0, -1));
  } else if (letter === "Enter") {
    const guessedWordStr = guessedWord.join('');
    const isValidWord = extractedWords.map(word => word.toLowerCase()).includes(guessedWordStr.toLowerCase());
    console.log(`Checking win condition...`);
    console.log(`guessedWord: "${guessedWord}" | currentWord: "${currentWord}"`);
    if (guessedWordStr.length !== currentWord.length) {
      triggerShakeEffect();
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


}

const triggerWin = () => {
  addStatusesandClasses()
  console.log("triggerWin function is running");
  setGameWon(true)
}

const triggerLoss = () => {
  addStatusesandClasses()
  console.log("triggerLoss function is running");
  setGameLoss(true)
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


    // keyboard elements: nested map to iterate over elements in nested arrays
    const keyboardElements = keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex}>{row.map((letter, letterIndex) => (
        <button key={letterIndex} onClick={() => guessWord(letter)}>{letter}</button>))}
        </div>
    ))

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
    <>
    {toastMessage && <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500">Not in word list!</div>}
    {/* Toast for words not in the list */}
{/* Title For Application Goes Here */}
<header><h1 className="text-3xl font-bold text-center text-red-500 mt-16 mb-8">
  Hashle: New Twists, New Varieties
</h1></header>
{/* Guess Counter (Attempts Left) - Build Out This Section*/}
<section><h3 className="text-center mb-16">{gameWon ? "CONGRATULATIONS! YOU WIN!" : gameLoss ? "SORRY! BETTER LUCK NEXT TIME!" : null}</h3></section>
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
</>
  )
}


export default App
