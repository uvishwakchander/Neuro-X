const symbols = ["🔺", "🔵", "🟩", "⭐"];

export function mountMemoryGame(container, onSaveScore) {
  let sequence = [];
  let userInput = [];
  let round = 0;

  container.innerHTML = `
    <h3>Memory Game</h3>
    <p>Repeat the symbol sequence in order.</p>
    <button id="start-memory" class="btn primary">Start Memory Game</button>
    <p>Round: <span id="memory-round">0</span></p>
    <div id="memory-seq" class="sequence-row"></div>
    <h4>Choose symbols</h4>
    <div id="memory-options" class="sequence-row"></div>
  `;

  const seqNode = container.querySelector("#memory-seq");
  const optionsNode = container.querySelector("#memory-options");
  const roundNode = container.querySelector("#memory-round");

  symbols.forEach((sym) => {
    const btn = document.createElement("button");
    btn.className = "shape";
    btn.textContent = sym;
    btn.addEventListener("click", () => handleInput(sym));
    optionsNode.appendChild(btn);
  });

  function renderSequence() {
    seqNode.innerHTML = sequence.map((s) => `<div class="shape">${s}</div>`).join("");
  }

  function nextRound() {
    round += 1;
    roundNode.textContent = String(round);
    userInput = [];
    sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    renderSequence();
  }

  function handleInput(sym) {
    if (!sequence.length) return;
    userInput.push(sym);
    const idx = userInput.length - 1;
    if (userInput[idx] !== sequence[idx]) {
      onSaveScore("Memory", round);
      alert(`Memory game ended at round ${round}`);
      sequence = [];
      userInput = [];
      round = 0;
      roundNode.textContent = "0";
      seqNode.innerHTML = "";
      return;
    }
    if (userInput.length === sequence.length) {
      setTimeout(nextRound, 450);
    }
  }

  container.querySelector("#start-memory").addEventListener("click", () => {
    sequence = [];
    userInput = [];
    round = 0;
    nextRound();
  });
}
