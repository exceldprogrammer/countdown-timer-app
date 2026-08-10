const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const hourInput = document.getElementById("hourInput");
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const alertSound = new Audio(
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
);
alertSound.loop = true;
const timeUpModal = document.getElementById('timeUpModal');
const dismissBtn = document.getElementById('dismissBtn');

let totalSeconds = 0;
let timerId = null;
let isRunning = false;

function updateDisplay() {
  const hour = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with a leading zero if needed (e.g. 5 -> "05")
  const hoursStr = String(hour).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  display.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function getInputinSeconds() {
  const hours = Number(hourInput.value) || 0;
  const seconds = Number(secondsInput.value) || 0;
  const minutes = Number(minutesInput.value) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}
function startTimer() {
  if (isRunning) return;

  if (totalSeconds === 0) {
    totalSeconds = getInputinSeconds();
  }
  if (totalSeconds === 0) {
    return;
  }
  isRunning = true;
  timerId = setInterval(() => {
    totalSeconds--;
    updateDisplay();
    if (totalSeconds <= 0) {
      clearInterval(timerId);
      isRunning = false;
      alertSound.play();
    timeUpModal.classList.remove('hidden');
    }
  }, 1000);
}
function pauseTimer() {
  clearInterval(timerId);
  isRunning = false;
}
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  totalSeconds = 0;
  display.textContent = "00:00:00";
}
dismissBtn.addEventListener('click', () => {
  alertSound.pause();
  alertSound.currentTime = 0;
  timeUpModal.classList.add('hidden');
});

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
pauseBtn.addEventListener("click", pauseTimer);
