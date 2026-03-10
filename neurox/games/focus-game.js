export function mountFocusGame(container, onSaveScore) {
  let score = 0;
  let misses = 0;
  let running = false;

  container.innerHTML = `
    <h3>Focus Game</h3>
    <p>Tap the moving target quickly. Accuracy boosts your score.</p>
    <button id="start-focus" class="btn primary">Start Focus Game</button>
    <p>Score: <span id="focus-score">0</span> | Misses: <span id="focus-miss">0</span></p>
    <div id="focus-area" class="game-area"></div>
  `;

  const area = container.querySelector("#focus-area");
  const scoreNode = container.querySelector("#focus-score");
  const missNode = container.querySelector("#focus-miss");
  let target;

  const moveTarget = () => {
    if (!target) return;
    const maxX = Math.max(0, area.clientWidth - 60);
    const maxY = Math.max(0, area.clientHeight - 60);
    target.style.left = `${Math.random() * maxX}px`;
    target.style.top = `${Math.random() * maxY}px`;
  };

  container.querySelector("#start-focus").addEventListener("click", () => {
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

    const moveTimer = setInterval(() => {
      if (!running) return;
      moveTarget();
    }, 850);

    target.addEventListener("click", () => {
      score += 1;
      scoreNode.textContent = String(score);
      moveTarget();
    });

    area.addEventListener("click", (e) => {
      if (e.target === target || !running) return;
      misses += 1;
      missNode.textContent = String(misses);
      if (misses >= 5) {
        running = false;
        clearInterval(moveTimer);
        onSaveScore("Focus", Math.max(0, score - misses));
        alert(`Game over! Final score: ${Math.max(0, score - misses)}`);
      }
    });
  });
}
