import { useState, useEffect } from 'react'
import './index.css'
import data from './data.json'

function App() {

  const extractedWords = data.map(element => element.word);
  console.log(extractedWords)
  const randomArrayWord = () => {
    const randomIndex = Math.floor(Math.random() * extractedWords.length);
    return extractedWords[randomIndex];
  }
  
  console.log(randomArrayWord())

  // Create a state for the word to be passed in
  const [currentWord, setCurrentWord] = useState(randomArrayWord())
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
  if (letter === "Delete") {
    setGuessedWord(prev => prev.slice(0, -1));
  } else if (letter === "Enter") {
    const guessedWordStr = guessedWord.join('');
    const isValidWord = extractedWords.map(word => word.toLowerCase()).includes(guessedWordStr.toLowerCase());
    if (guessedWordStr.length !== currentWord.length) {
      triggerShakeEffect();
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
  newStatuses = []
  letterCount = {}
  for (const [i, letter] of currentWord.entries()) {
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      letterCount[letter] = 1;
    } if (guessedWord[i] == currentWord[i]) {
      newStatuses[i] = "correct" 
      letterCount[letter]--;
    }
  }
    for (const [i, letter] of guessedWord.entries()) {
     if (letterCount[letter] > 0) {
      newStatuses[i] = "present"
      letterCount[letter]--;
    } else {
      newStatuses[i] = "absent";  
    }
  }
  setLetterStatuses(newStatuses)
  
  setCurrentRowIndex(prevRowIndex => prevRowIndex + 1)
  setGuessedWord([]);
};

classNames = []

const addClasses = () => {
  for (let i = 0; i < guessedWord.length; i++) {
    if (newStatus[i] == "correct") {
      classNames[i] = "bg-green"
    }
    else if (newStatus[i] == "present") {
      classNames[i] = "bg-yellow"
    } else if (newStatus[i] == "absent") {
      classNames[i] = "bg-gray"
    }

  }
}

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


// const isLetterGuessed = (letter) => {
//   if (guessedWord.includes((letter)) {

//   }
// }

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
<section><h3 className="text-center mb-16">Guesses Counter: Attempts Left Text Placeholder</h3></section>
{/* Message Section */}
{/* Word Input Field -- Build Out Here */}
{allGuesses.map((wordRow, index) => (
  <section 
  className={`text-center mt-2 ${index === shakeRowIndex ? 'shake' : ''}`} 
  key={index}
>
{wordRow.map((letter, key) => (
  <span key={key} className="w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block align-middle">{guessedWord[key] && index === emptyRowIndex ? guessedWord[key] : letter}</span>
))}
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
