export function getRandomWord(data) {
  const words = data.map(({ word }) => word);
  return words[Math.floor(Math.random() * words.length)];
}
