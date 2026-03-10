const symbols = ["🔺", "🔵", "🟩", "⭐", "🟣", "🟧"];

export function mountMemoryGame(container, onSaveScore) {
  let sequence = [];
  let userInput = [];
  let round = 0;
  let acceptingInput = false;
  let lives = 3;
  let speed = 600;

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

  function resetBoard() {
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

  async function playSequence() {
    acceptingInput = false;
    statusNode.textContent = "Watch carefully...";

    for (let i = 0; i < sequence.length; i += 1) {
      seqNode.innerHTML = sequence.map((sym, idx) => renderSymbol(sym, idx === i)).join("");
      await sleep(speed);
      renderBlankSequence();
      await sleep(Math.max(160, speed * 0.4));
    }

    userInput = [];
    acceptingInput = true;
    statusNode.textContent = "Now repeat the sequence.";
  }

  async function nextRound() {
    round += 1;
    roundNode.textContent = String(round);
    sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    renderBlankSequence();
    await playSequence();
  }

  function gameOver() {
    acceptingInput = false;
    const finalScore = Math.max(0, round - 1);
    onSaveScore("Memory", finalScore);
    alert(`Memory game ended. You reached round ${round}.`);
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
        setTimeout(() => {
          playSequence();
        }, 700);
      }
      return;
    }

    if (userInput.length === sequence.length) {
      statusNode.textContent = "Great! Next round...";
      setTimeout(() => {
        nextRound();
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
    speed = Number(difficultyNode.value);
    resetBoard();
    statusNode.textContent = "Memorize the pattern...";
    nextRound();
  });
}
