import { useState } from 'react'
import './index.css'

function App() {
  // Create a state for the word to be passed in
  const [currentWord, setCurrentWord] = useState("Apple")
  // Create another state for the word the user guesses
  const [guessedWord, setGuessedWord] = useState([])
  // Create a state for all guesses (an array of arrays)
  const [allGuesses, setAllGuesses] = useState([])
  // Create a state to disable/enable the button
  // const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Convert the word from a string to an array so we can map the letters
  const currentWordArray = currentWord.split("")
  // Create a blank array with the same letter count as the current word
  const wordRow = currentWordArray.map((letter) => ('')); 

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Delete"]
  ];

  // Word Guessing Logic: 

  // Create a function to let a user submit a guess
  // const handleSubmit = () => {

  //   if (guessedWord.length === currentWord.length) {
  //     setIsSubmitDisabled(false)
  //   }
  // }

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
  setGuessedWord("");
}


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

  return (
    <>
{/* Title For Application Goes Here */}
<header><h1 className="text-3xl font-bold text-center text-red-500 mt-16 mb-8">
  My Word Game: Title Placeholder
</h1></header>
{/* Guess Counter (Attempts Left) - Build Out This Section*/}
<section><h3 className="text-center">Guesses Counter: Attempts Left Text Placeholder</h3></section>
{/* Message Section */}
{/* Word Input Field -- Build Out Here */}
<section className="text-center mt-16">{wordRow.map((letter, key) => (
  <span key={`${guessedWord[key]}-${key}`} className="w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block align-middle">{guessedWord[key] ? guessedWord[key] : letter}</span>
))}
 </section>
{/* Keyboard Section */}
<section className="text-center mt-16">
                {keyboardElements}
</section>
{/* Submit Button */}
<section className="text-center mt-16"><button type="submit">Submit</button></section>
    </>
  )
}

export default App
