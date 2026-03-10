export function mountFocusGame(container, onSaveScore) {
  let hits = 0;
  let misses = 0;
  let timeLeft = 25;
  let running = false;
  let moveTimer = null;
  let gameTimer = null;

  container.innerHTML = `
    <h3>Focus Game</h3>
    <p>Hit the glowing orb. Reduced speed for better control.</p>
    <button id="start-focus" class="btn primary">Start Focus Game</button>
    <p>
      Time: <span id="focus-time">25</span>s |
      Hits: <span id="focus-hits">0</span> |
      Misses: <span id="focus-miss">0</span> |
      Score: <span id="focus-score">0</span>
    </p>
    <div id="focus-area" class="game-area"></div>
  `;

  const area = container.querySelector("#focus-area");
  const timeNode = container.querySelector("#focus-time");
  const hitNode = container.querySelector("#focus-hits");
  const missNode = container.querySelector("#focus-miss");
  const scoreNode = container.querySelector("#focus-score");
  let target = null;

  const calcScore = () => Math.max(0, Math.round(hits * 10 - misses * 3));

  const moveTarget = () => {
    if (!target) return;
    const maxX = Math.max(0, area.clientWidth - 64);
    const maxY = Math.max(0, area.clientHeight - 64);
    target.style.left = `${Math.random() * maxX}px`;
    target.style.top = `${Math.random() * maxY}px`;
  };

  function stopGame() {
    running = false;
    if (moveTimer) clearInterval(moveTimer);
    if (gameTimer) clearInterval(gameTimer);
    const finalScore = calcScore();
    scoreNode.textContent = String(finalScore);
    onSaveScore("Focus", finalScore);
    alert(`Focus Game complete! Score: ${finalScore}`);
  }

  function resetBoard() {
    hits = 0;
    misses = 0;
    timeLeft = 25;
    hitNode.textContent = "0";
    missNode.textContent = "0";
    timeNode.textContent = "25";
    scoreNode.textContent = "0";
    area.innerHTML = "";
    target = document.createElement("button");
    target.className = "target";
    target.setAttribute("aria-label", "moving target");
    area.appendChild(target);
    moveTarget();

    target.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!running) return;
      hits += 1;
      hitNode.textContent = String(hits);
      scoreNode.textContent = String(calcScore());
      moveTarget();
    });
  }

  area.onclick = () => {
    if (!running) return;
    misses += 1;
    missNode.textContent = String(misses);
    scoreNode.textContent = String(calcScore());
  };

  container.querySelector("#start-focus").addEventListener("click", () => {
    if (moveTimer) clearInterval(moveTimer);
    if (gameTimer) clearInterval(gameTimer);

    resetBoard();
    running = true;

    moveTimer = setInterval(() => {
      if (!running) return;
      moveTarget();
    }, 1300);

    gameTimer = setInterval(() => {
      if (!running) return;
      timeLeft -= 1;
      timeNode.textContent = String(timeLeft);
      if (timeLeft <= 0) stopGame();
    }, 1000);
  });
}
