function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function moodTrend(logs) {
  if (!logs.length) return "No mood data yet";
  const recent = logs.slice(-5).map((log) => log.moodLabel);
  return `Recent moods: ${recent.join(" → ")}`;
}

export function renderDashboard(container, store) {
  const gameScores = store.get("gameScores", []);
  const moods = store.get("moodLogs", []);
  const reminderState = store.get("reminders", {});
  const focusScores = gameScores
    .filter((item) => item.game === "Focus")
    .map((item) => item.score);

  container.innerHTML = `
    <div class="card">
      <h2>Progress Dashboard</h2>
      <div class="stat-grid">
        <div class="stat">
          <small>Games Played</small>
          <strong>${gameScores.length}</strong>
        </div>
        <div class="stat">
          <small>Avg Focus Score</small>
          <strong>${average(focusScores).toFixed(1)}</strong>
        </div>
        <div class="stat">
          <small>Hydration Streak</small>
          <strong>${reminderState.hydrationStreak || 0}</strong>
        </div>
        <div class="stat">
          <small>Mood Trend</small>
          <strong>${moodTrend(moods)}</strong>
        </div>
      </div>
      <canvas id="progress-chart" width="600" height="220"></canvas>
    </div>
  `;

  const chart = container.querySelector("#progress-chart");
  const ctx = chart.getContext("2d");
  const lastScores = gameScores.slice(-8);
  ctx.clearRect(0, 0, chart.width, chart.height);
  ctx.strokeStyle = "#4f7cff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  lastScores.forEach((point, index) => {
    const x = (index / Math.max(1, lastScores.length - 1)) * (chart.width - 40) + 20;
    const y = chart.height - Math.min(200, point.score * 12) - 10;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
