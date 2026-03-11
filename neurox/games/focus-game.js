export function mountFocusGame(container, onSaveScore) {
  let score = 0;
  let misses = 0;
  let running = false;
  let moveTimer = null;

  container.innerHTML = `
    <h3>Focus Game</h3>
    <p>Tap the moving target. It now moves slower for a calmer experience.</p>
    <button id="start-focus" class="btn primary">Start Focus Game</button>
    <p>Score: <span id="focus-score">0</span> | Misses: <span id="focus-miss">0</span></p>
    <div id="focus-area" class="game-area"></div>
  `;

  const area = container.querySelector("#focus-area");
  const scoreNode = container.querySelector("#focus-score");
  const missNode = container.querySelector("#focus-miss");
  let target = null;

  const moveTarget = () => {
    if (!target) return;
    const maxX = Math.max(0, area.clientWidth - 60);
    const maxY = Math.max(0, area.clientHeight - 60);
    target.style.left = `${Math.random() * maxX}px`;
    target.style.top = `${Math.random() * maxY}px`;
  };

  const endGame = () => {
    if (moveTimer) clearInterval(moveTimer);
    moveTimer = null;
    running = false;
    const finalScore = Math.max(0, score - misses);
    onSaveScore("Focus", finalScore);
    alert(`Game over! Final score: ${finalScore}`);
  };

  container.querySelector("#start-focus").addEventListener("click", () => {
    if (moveTimer) clearInterval(moveTimer);

    score = 0;
    misses = 0;
    running = true;
    scoreNode.textContent = "0";
    missNode.textContent = "0";

    area.innerHTML = "";
    target = document.createElement("button");
    target.className = "target";
    target.setAttribute("aria-label", "target");
    area.appendChild(target);
    moveTarget();

    moveTimer = setInterval(() => {
      if (!running) return;
      moveTarget();
    }, 1300);

    target.onclick = () => {
      if (!running) return;
      score += 1;
      scoreNode.textContent = String(score);
      moveTarget();
    };

    area.onclick = (e) => {
      if (!running || e.target === target) return;
      misses += 1;
      missNode.textContent = String(misses);
      if (misses >= 5) endGame();
    };
  });
}
