const items = ["🌟", "🧩", "🎯", "🧠", "💧"];

export function mountSmallMatchGame(container, onSaveScore) {
  let rounds = 0;
  let score = 0;
  let target = "";

  container.innerHTML = `
    <h3>Small Game: Quick Match</h3>
    <p>Pick the matching symbol. 10 rounds total.</p>
    <p>Round: <span id="match-round">0</span>/10 | Score: <span id="match-score">0</span></p>
    <h4 id="match-target">Press start to begin</h4>
    <button id="start-match" class="btn primary">Start</button>
    <div id="match-options" class="pattern-options"></div>
  `;

  const roundNode = container.querySelector("#match-round");
  const scoreNode = container.querySelector("#match-score");
  const targetNode = container.querySelector("#match-target");
  const optionsNode = container.querySelector("#match-options");

  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

  function nextRound() {
    rounds += 1;
    roundNode.textContent = String(rounds);
    target = items[Math.floor(Math.random() * items.length)];
    targetNode.textContent = `Tap this symbol: ${target}`;

    const options = shuffle([target, ...shuffle(items.filter((i) => i !== target)).slice(0, 2)]);
    optionsNode.innerHTML = "";
    options.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "pattern-item";
      btn.textContent = item;
      btn.addEventListener("click", () => {
        if (item === target) score += 1;
        scoreNode.textContent = String(score);
        if (rounds >= 10) {
          onSaveScore("SmallMatch", score);
          alert(`Quick Match complete! Score: ${score}/10`);
          rounds = 0;
          score = 0;
          roundNode.textContent = "0";
          scoreNode.textContent = "0";
          targetNode.textContent = "Press start to begin";
          optionsNode.innerHTML = "";
          return;
        }
        nextRound();
      });
      optionsNode.appendChild(btn);
    });
  }

  container.querySelector("#start-match").addEventListener("click", () => {
    rounds = 0;
    score = 0;
    roundNode.textContent = "0";
    scoreNode.textContent = "0";
    nextRound();
  });
}
