export function mountSmallTapGame(container, onSaveScore) {
  let score = 0;
  let timeLeft = 15;
  let timerId = null;

  container.innerHTML = `
    <h3>Small Game: Speed Tap</h3>
    <p>Tap the button as many times as you can in 15 seconds.</p>
    <p>Time Left: <span id="tap-time">15</span>s | Score: <span id="tap-score">0</span></p>
    <div class="button-row">
      <button id="start-tap" class="btn primary">Start</button>
      <button id="tap-btn" class="btn" disabled>Tap!</button>
    </div>
  `;

  const timeNode = container.querySelector("#tap-time");
  const scoreNode = container.querySelector("#tap-score");
  const tapBtn = container.querySelector("#tap-btn");

  const stopGame = () => {
    tapBtn.disabled = true;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    onSaveScore("SmallTap", score);
    alert(`Speed Tap complete! Score: ${score}`);
  };

  container.querySelector("#start-tap").addEventListener("click", () => {
    score = 0;
    timeLeft = 15;
    scoreNode.textContent = "0";
    timeNode.textContent = "15";
    tapBtn.disabled = false;

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft -= 1;
      timeNode.textContent = String(timeLeft);
      if (timeLeft <= 0) {
        stopGame();
      }
    }, 1000);
  });

  tapBtn.addEventListener("click", () => {
    score += 1;
    scoreNode.textContent = String(score);
  });
}
