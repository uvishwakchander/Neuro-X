function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function moodTrend(logs) {
  if (!logs.length) return "No mood data yet";
  const recent = logs.slice(-5).map((log) => log.moodLabel);
  return `Recent moods: ${recent.join(" → ")}`;
}

function leaderboard(scores) {
  const grouped = new Map();
  scores.forEach((item) => {
    const player = item.player || "Guest";
    grouped.set(player, (grouped.get(player) || 0) + Number(item.score || 0));
  });

  return [...grouped.entries()]
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
}

function recentActivity(scores) {
  return scores
    .slice()
    .reverse()
    .slice(0, 5)
    .map((item) => {
      const when = new Date(item.date).toLocaleString();
      return `${item.player || "Guest"} scored ${item.score} in ${item.game} (${when})`;
    });
}

export function renderDashboard(container, store) {
  const gameScores = store.get("gameScores", []);
  const moods = store.get("moodLogs", []);
  const reminderState = store.get("reminders", {});
  const checkins = store.get("otherCheckins", {});
  const focusScores = gameScores.filter((item) => item.game === "Focus").map((item) => item.score);
  const board = leaderboard(gameScores);
  const profile = store.get("profile", { name: "Guest" });
  const activity = recentActivity(gameScores);
  const activeReminderCount = ["hydration", "eyeCare", "break"].filter((k) => reminderState[k]).length;

  container.innerHTML = `
    <div class="card">
      <h2>Progress Dashboard</h2>
      <p class="subtle">Welcome back, <strong>${profile.name}</strong>. Here is your calm productivity snapshot.</p>
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

    <div class="card two-col-grid">
      <div>
        <h3>Wellbeing Snapshot</h3>
        <div class="post">
          <p><strong>Active reminders:</strong> ${activeReminderCount}/3</p>
          <p><strong>Energy:</strong> ${checkins.energy?.value || "Not set"}</p>
          <p><strong>Stress:</strong> ${checkins.stress?.value || "Not set"}</p>
          <p><strong>Sleep:</strong> ${checkins.sleep?.value || "Not set"}</p>
        </div>
      </div>
      <div>
        <h3>Recent Game Activity</h3>
        <div class="post">
          ${activity.length ? activity.map((item) => `<p>• ${item}</p>`).join("") : "<p>No games played yet.</p>"}
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Community Leaderboard</h3>
      <div class="leaderboard">
        ${board
          .map(
            (entry, idx) => `
              <div class="leader-row">
                <strong>#${idx + 1} ${entry.name}</strong>
                <span>${entry.points} pts</span>
              </div>
            `,
          )
          .join("")}
      </div>
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
