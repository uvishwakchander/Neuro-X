function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function moodTrend(logs) {
  if (!logs.length) return "No mood data yet";
  const recent = logs.slice(-5).map((log) => log.moodLabel);
  return recent.join(" → ");
}

function leaderboardRows(currentPlayer, gameScores) {
  const grouped = {};
  gameScores.forEach((s) => {
    const key = s.player || currentPlayer || "Guest";
    grouped[key] = (grouped[key] || 0) + (s.score || 0);
  });
  const sample = [
    { name: "Sanju Samson", score: 128 },
    { name: "Smirthi Madana", score: 114 },
  ];
  const dynamic = Object.entries(grouped).map(([name, score]) => ({ name, score }));
  return [...sample, ...dynamic]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function renderDashboard(container, store) {
  const gameScores = store.get("gameScores", []);
  const moods = store.get("moodLogs", []);
  const reminderState = store.get("reminders", {});
  const playerName = store.get("playerName", "Guest");

  const focusScores = gameScores.filter((item) => item.game === "Focus").map((item) => item.score);
  const board = leaderboardRows(playerName, gameScores);

  container.innerHTML = `
    <div class="card">
      <h2>Progress Dashboard</h2>
      <div class="badge-row">
        <span class="badge">Current Player: ${playerName}</span>
        <span class="badge">Sessions: ${gameScores.length}</span>
      </div>
      <div class="stat-grid">
        <div class="stat"><small>Games Played</small><strong>${gameScores.length}</strong></div>
        <div class="stat"><small>Avg Focus Score</small><strong>${average(focusScores).toFixed(1)}</strong></div>
        <div class="stat"><small>Hydration Streak</small><strong>${reminderState.hydrationStreak || 0}</strong></div>
        <div class="stat"><small>Mood Trend</small><strong>${moodTrend(moods)}</strong></div>
      </div>
      <h3 style="margin-top:1rem">Top Players</h3>
      <div class="post">
        ${board.map((p, i) => `<p>${i + 1}. <strong>${p.name}</strong> — ${p.score} pts</p>`).join("")}
      </div>
      <canvas id="progress-chart" width="600" height="220"></canvas>
    </div>
  `;

  const chart = container.querySelector("#progress-chart");
  const ctx = chart.getContext("2d");
  const lastScores = gameScores.slice(-10);
  ctx.clearRect(0, 0, chart.width, chart.height);
  ctx.strokeStyle = "#53a7ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  lastScores.forEach((point, index) => {
    const x = (index / Math.max(1, lastScores.length - 1)) * (chart.width - 40) + 20;
    const y = chart.height - Math.min(180, point.score * 8) - 15;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
