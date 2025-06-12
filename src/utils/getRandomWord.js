// This function returns a daily word based on the current date.
// It uses a fixed seed for shuffling to ensure the same word is returned each day.

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
  const words = data.map(({ word }) => word);
  const now = new Date(Date.now());
  const epoch = new Date(Date.UTC(2023, 0, 1));
  const diff = Math.floor(
    (Date.now() - Date.UTC(2023, 0, 1)) / (1000 * 60 * 60 * 24)
  );

  const shuffledWords = shuffleArray(words, 42); // Using a fixed seed for consistent shuffling
  // Use the diff to select a word based on the shuffled array
  const index = diff % shuffledWords.length;

  return shuffledWords[index];
}
