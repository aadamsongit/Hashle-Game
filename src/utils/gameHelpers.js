// Function to get the current day index based on the start date
export function getDayIndex() {
  const today = new Date(Date.now()); // Or just: new Date()
  const start = new Date(Date.UTC(2023, 0, 1)); // Match the daily word logic
  const diffTime = today - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
// Function to save the board state to localStorage
export function saveToLocalStorage(boardState, outcome, dayIndex) {
  const storedData = JSON.parse(localStorage.getItem("dailyResults")) || {};
  storedData[dayIndex] = {
    boardState,
    outcome,
    dayIndex,
    date: new Date().toISOString(),
  };
  localStorage.setItem("dailyResults", JSON.stringify(storedData));
}
