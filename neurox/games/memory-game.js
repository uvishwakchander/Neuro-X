const symbols = ["🔺", "🔵", "🟩", "⭐"];

export function mountMemoryGame(container, onSaveScore) {
  let sequence = [];
  let userInput = [];
  let round = 0;
  let inputEnabled = false;

  container.innerHTML = `
    <h3>Memory Game</h3>
    <p>Watch sequence carefully, then repeat in same order.</p>
    <button id="start-memory" class="btn primary">Start Memory Game</button>
    <p>Round: <span id="memory-round">0</span> | Best: <span id="memory-best">0</span></p>
    <div id="memory-status" class="badge">Press start</div>
    <div id="memory-seq" class="sequence-row"></div>
    <h4>Choose symbols</h4>
    <div id="memory-options" class="sequence-row"></div>
  `;

  const seqNode = container.querySelector("#memory-seq");
  const optionsNode = container.querySelector("#memory-options");
  const roundNode = container.querySelector("#memory-round");
  const statusNode = container.querySelector("#memory-status");
  const bestNode = container.querySelector("#memory-best");
  let best = 0;

  symbols.forEach((sym) => {
    const btn = document.createElement("button");
    btn.className = "shape";
    btn.textContent = sym;
    btn.addEventListener("click", () => handleInput(sym));
    optionsNode.appendChild(btn);
  });

  function flashSymbol(sym, active) {
    const el = document.createElement("div");
    el.className = "shape";
    el.textContent = sym;
    if (active) el.style.background = "#3d7dff";
    return el;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function playSequence() {
    inputEnabled = false;
    statusNode.textContent = "Watch sequence...";
    seqNode.innerHTML = "";

    for (const sym of sequence) {
      seqNode.innerHTML = "";
      seqNode.appendChild(flashSymbol(sym, true));
      await sleep(550);
      seqNode.innerHTML = "";
      await sleep(220);
    }

    seqNode.innerHTML = sequence.map((s) => `<div class='shape'>${s}</div>`).join("");
    statusNode.textContent = "Your turn";
    inputEnabled = true;
  }

  async function nextRound() {
    round += 1;
    roundNode.textContent = String(round);
    best = Math.max(best, round - 1);
    bestNode.textContent = String(best);
    userInput = [];
    sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    await playSequence();
  }

  function resetGame() {
    inputEnabled = false;
    onSaveScore("Memory", Math.max(0, round - 1));
    alert(`Memory game ended at round ${round}`);
    best = Math.max(best, round - 1);
    bestNode.textContent = String(best);
    sequence = [];
    userInput = [];
    round = 0;
    roundNode.textContent = "0";
    statusNode.textContent = "Press start";
    seqNode.innerHTML = "";
  }

  async function handleInput(sym) {
    if (!inputEnabled || !sequence.length) return;
    userInput.push(sym);
    const idx = userInput.length - 1;

    if (userInput[idx] !== sequence[idx]) {
      resetGame();
      return;
    }

    if (userInput.length === sequence.length) {
      statusNode.textContent = "Correct! Next round...";
      inputEnabled = false;
      await sleep(500);
      nextRound();
    }
  }

  container.querySelector("#start-memory").addEventListener("click", () => {
    sequence = [];
    userInput = [];
    round = 0;
    nextRound();
  });
}
