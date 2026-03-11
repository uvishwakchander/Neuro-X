const symbols = ["🔺", "🔵", "🟩", "⭐", "🟣", "🟧"];

export function mountMemoryGame(container, onSaveScore) {
  let sequence = [];
  let userInput = [];
  let round = 0;
  let acceptingInput = false;
  let lives = 3;
  let speed = 600;
  let gameToken = 0;
  let replayTimer = null;
  let nextRoundTimer = null;

  container.innerHTML = `
    <h3>Memory Game</h3>
    <p>Watch the sequence, then repeat it in order.</p>
    <div class="input-row">
      <select id="memory-difficulty">
        <option value="650">Calm (slow)</option>
        <option value="500">Classic</option>
        <option value="380">Fast</option>
      </select>
      <button id="start-memory" class="btn primary">Start Memory Game</button>
    </div>
    <p>Round: <span id="memory-round">0</span> | Lives: <span id="memory-lives">3</span></p>
    <p id="memory-status" class="subtle">Press start to begin.</p>
    <div id="memory-seq" class="sequence-row"></div>
    <h4>Choose symbols</h4>
    <div id="memory-options" class="sequence-row"></div>
  `;

  const seqNode = container.querySelector("#memory-seq");
  const optionsNode = container.querySelector("#memory-options");
  const roundNode = container.querySelector("#memory-round");
  const livesNode = container.querySelector("#memory-lives");
  const statusNode = container.querySelector("#memory-status");
  const difficultyNode = container.querySelector("#memory-difficulty");

  function clearPendingTimers() {
    if (replayTimer) clearTimeout(replayTimer);
    if (nextRoundTimer) clearTimeout(nextRoundTimer);
    replayTimer = null;
    nextRoundTimer = null;
  }

  function resetBoard() {
    clearPendingTimers();
    sequence = [];
    userInput = [];
    round = 0;
    lives = 3;
    acceptingInput = false;
    roundNode.textContent = "0";
    livesNode.textContent = "3";
    seqNode.innerHTML = "";
    statusNode.textContent = "Press start to begin.";
  }

  function renderSymbol(sym, active) {
    return `<div class="shape ${active ? "shape-active" : ""}">${sym}</div>`;
  }

  function renderBlankSequence() {
    seqNode.innerHTML = sequence.map((s) => renderSymbol(s, false)).join("");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function playSequence(token) {
    if (token !== gameToken) return;

    acceptingInput = false;
    statusNode.textContent = "Watch carefully...";

    for (let i = 0; i < sequence.length; i += 1) {
      if (token !== gameToken) return;
      seqNode.innerHTML = sequence.map((sym, idx) => renderSymbol(sym, idx === i)).join("");
      await sleep(speed);
      if (token !== gameToken) return;
      renderBlankSequence();
      await sleep(Math.max(160, speed * 0.4));
    }

    if (token !== gameToken) return;
    userInput = [];
    acceptingInput = true;
    statusNode.textContent = "Now repeat the sequence.";
  }

  function nextRound(token) {
    if (token !== gameToken) return;
    round += 1;
    roundNode.textContent = String(round);
    sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    renderBlankSequence();
    playSequence(token);
  }

  function gameOver() {
    acceptingInput = false;
    clearPendingTimers();
    const finalScore = Math.max(0, round - 1);
    onSaveScore("Memory", finalScore);
    alert(`Memory game ended. You reached round ${round}.`);
    gameToken += 1;
    resetBoard();
  }

  function handleInput(sym) {
    if (!acceptingInput || !sequence.length) return;

    userInput.push(sym);
    const idx = userInput.length - 1;

    if (userInput[idx] !== sequence[idx]) {
      lives -= 1;
      livesNode.textContent = String(lives);
      acceptingInput = false;
      if (lives <= 0) {
        gameOver();
      } else {
        statusNode.textContent = `Not quite! ${lives} lives left. Replaying sequence...`;
        const token = gameToken;
        replayTimer = setTimeout(() => {
          playSequence(token);
        }, 700);
      }
      return;
    }

    if (userInput.length === sequence.length) {
      statusNode.textContent = "Great! Next round...";
      const token = gameToken;
      nextRoundTimer = setTimeout(() => {
        nextRound(token);
      }, 500);
    }
  }

  symbols.forEach((sym) => {
    const btn = document.createElement("button");
    btn.className = "shape";
    btn.textContent = sym;
    btn.addEventListener("click", () => handleInput(sym));
    optionsNode.appendChild(btn);
  });

  container.querySelector("#start-memory").addEventListener("click", () => {
    gameToken += 1;
    speed = Number(difficultyNode.value);
    resetBoard();
    statusNode.textContent = "Memorize the pattern...";
    nextRound(gameToken);
  });
}
