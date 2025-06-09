// export function getRandomWord(data) {
//   console.log("data:", data);
//   const words = data.map(({ word }) => word);
//   return words[Math.floor(Math.random() * words.length)];
// }

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleArray(array, seed) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getDailyWord(data) {
  console.log("data:", data);
  const words = data.map(({ word }) => word);
  const epoch = new Date("2023-01-01");
  const now = new Date();
  const diff = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));

  const shuffledWords = shuffleArray(words, 42); // Using a fixed seed for consistent shuffling
  console.log("word list:", words);
  // Use the diff to select a word based on the shuffled array
  console.log("shuffled list:", shuffledWords);
  const index = diff % shuffledWords.length;

  return shuffledWords[index];
}

// export { getDailyWord };

// console.log("index:", index);
// console.log("chosen word:", shuffledWords[index]);
