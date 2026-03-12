const symbols = ["🔺", "🔵", "🟩", "⭐", "🟣", "🟧"];

export function mountMemoryGame(container, onSaveScore) {
  let sequence = [];
  let userInput = [];
  let round = 0;
  let acceptingInput = false;

  container.innerHTML = `
    <h3>Memory Game</h3>
    <p>Watch the sequence, then repeat it in order.</p>
    <button id="start-memory" class="btn primary">Start Memory Game</button>
    <p>Round: <span id="memory-round">0</span></p>
    <p id="memory-status" class="subtle">Press start to begin.</p>
    <div id="memory-seq" class="sequence-row"></div>
    <h4>Choose symbols</h4>
    <div id="memory-options" class="sequence-row"></div>
  `;

  const seqNode = container.querySelector("#memory-seq");
  const optionsNode = container.querySelector("#memory-options");
  const roundNode = container.querySelector("#memory-round");
  const statusNode = container.querySelector("#memory-status");

  function resetBoard() {
    sequence = [];
    userInput = [];
    round = 0;
    acceptingInput = false;
    roundNode.textContent = "0";
    seqNode.innerHTML = "";
    statusNode.textContent = "Press start to begin.";
  }

  function flashSymbol(sym, active) {
    return `<div class="shape ${active ? "shape-active" : ""}">${sym}</div>`;
  }

  function renderBlankSequence() {
    seqNode.innerHTML = sequence.map((s) => flashSymbol(s, false)).join("");
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function playSequence() {
    acceptingInput = false;
    statusNode.textContent = "Watch carefully...";

    for (let i = 0; i < sequence.length; i += 1) {
      seqNode.innerHTML = sequence
        .map((sym, idx) => flashSymbol(sym, idx === i))
        .join("");
      await sleep(600);
      renderBlankSequence();
      await sleep(240);
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

  function handleInput(sym) {
    if (!acceptingInput || !sequence.length) return;

    userInput.push(sym);
    const idx = userInput.length - 1;

    if (userInput[idx] !== sequence[idx]) {
      acceptingInput = false;
      onSaveScore("Memory", Math.max(0, round - 1));
      alert(`Memory game ended at round ${round}. Great try!`);
      resetBoard();
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
    resetBoard();
    nextRound();
  });
}
