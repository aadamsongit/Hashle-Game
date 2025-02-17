import { useState } from 'react'
import './index.css'

function App() {
  const [currentWord, setCurrentWord] = useState("Assembly")

  // Convert the word from a string to an array so we can map the letters
  const currentWordArray = currentWord.split("")

  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "Delete"]
  ];

  // keyboard elements: nested map to iterate over elements in nested arrays
  const keyboardElements = keyboardRows.map((row, rowIndex) => (
    <div key={rowIndex}>{row.map((letter, letterIndex) => (
      <button key={letterIndex}>{letter}</button>))}
      </div>
  ))

  

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
<section className="text-center mt-16">{currentWordArray.map((letter, key) => (
  <span key={key} className="w-10 h-10 size-16 border-2 border-indigo-500/50 inline-block">{letter}</span>
))}
 </section>
{/* Keyboard Section */}
<section className="text-center mt-16">
                {keyboardElements}
            </section>
{/* Submit Button */}
    </>
  )
}

export default App
