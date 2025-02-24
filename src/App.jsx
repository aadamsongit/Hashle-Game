import { useState, useEffect } from 'react'
import './index.css'

function App() {
  // Create a state for the word to be passed in
  const [currentWord, setCurrentWord] = useState("Apple")
  // Create another state for the word the user guesses
  const [guessedWord, setGuessedWord] = useState([])
  // Create a state for all guesses (an array of arrays)
  const [allGuesses, setAllGuesses] = useState([])

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
    if (letter === "Delete") {
      setGuessedWord(prev => prev.slice(0, -1))
    } else if (letter === "Enter") {
      guessedWord.length === currentWord.length? 
      addtoGuessandReset() :
      console.log("Null")
    } else {
    setGuessedWord(prev => [...prev, letter]);
  }
}

const addtoGuessandReset = () => {
  setAllGuesses(prevGuesses => [...prevGuesses, guessedWord])
  setGuessedWord([]);
}

// const arrayofGuesses = () => {
//   let missingRows = []
//   for (let i = 0; i < (currentWord.length + 1 - allGuesses.length); i++) 
//       missingRows.push(wordRow)
//  setAllGuesses([...allGuesses, ...missingRows])
//   }

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
  console.log(allGuesses)

// const isLetterGuessed = (letter) => {
//   if (guessedWord.includes((letter)) {

//   }
// }

const emptyRowIndex = allGuesses.findIndex(row => row.every(element => element === "" || element === "_"));
console.log(emptyRowIndex)

  return (
    <>
{/* Title For Application Goes Here */}
<header><h1 className="text-3xl font-bold text-center text-red-500 mt-16 mb-8">
  My Word Game: Title Placeholder
</h1></header>
{/* Guess Counter (Attempts Left) - Build Out This Section*/}
<section><h3 className="text-center mb-16">Guesses Counter: Attempts Left Text Placeholder</h3></section>
{/* Message Section */}
{/* Word Input Field -- Build Out Here */}
{allGuesses.map((wordRow, index) => (
<section className="text-center mt-2" key={index}>{wordRow.map((letter, key) => (
  <span key={key} className="w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block align-middle">{guessedWord[key] && index === emptyRowIndex ? guessedWord[key] : letter}</span>
))}
 </section>
))}
{/* Keyboard Section */}
<section className="text-center mt-16">
                {keyboardElements}
</section>
{/* Submit Button */}
{/* <section className="text-center mt-16"><button type="submit">Submit</button></section> */}
    </>
  )
}

export default App
