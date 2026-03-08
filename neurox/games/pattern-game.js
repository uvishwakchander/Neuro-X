const patterns = [
  { seq: [2, 4, 6], answer: 8, choices: [7, 8, 9] },
  { seq: [1, 1, 2, 3], answer: 5, choices: [4, 5, 6] },
  { seq: [3, 6, 12], answer: 24, choices: [18, 24, 21] },
  { seq: [5, 10, 15], answer: 20, choices: [20, 25, 30] },
];

export function mountPatternGame(container, onSaveScore) {
  let score = 0;
  let current = null;

  container.innerHTML = `
    <h3>Pattern Game</h3>
    <p>Find the next item in each pattern.</p>
    <button id="start-pattern" class="btn primary">Start Pattern Game</button>
    <p>Score: <span id="pattern-score">0</span></p>
    <h4 id="pattern-question">Press start to begin.</h4>
    <div id="pattern-options" class="pattern-options"></div>
  `;

  const qNode = container.querySelector("#pattern-question");
  const options = container.querySelector("#pattern-options");
  const scoreNode = container.querySelector("#pattern-score");

  function nextQuestion() {
    current = patterns[Math.floor(Math.random() * patterns.length)];
    qNode.textContent = `${current.seq.join(" , ")} , ?`;
    options.innerHTML = "";
    current.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "pattern-item";
      btn.textContent = String(choice);
      btn.addEventListener("click", () => {
        if (choice === current.answer) {
          score += 1;
          scoreNode.textContent = String(score);
          nextQuestion();
        } else {
          onSaveScore("Pattern", score);
          alert(`Pattern game ended. Score: ${score}`);
          score = 0;
          scoreNode.textContent = "0";
          qNode.textContent = "Press start to begin.";
          options.innerHTML = "";
        }
      });
      options.appendChild(btn);
    });
  }

  container.querySelector("#start-pattern").addEventListener("click", () => {
    score = 0;
    scoreNode.textContent = "0";
    nextQuestion();
  });
}
