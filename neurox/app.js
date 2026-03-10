import { renderNavbar } from "./components/navbar.js";
import { renderDashboard } from "./components/dashboard.js";
import { renderReminders } from "./components/reminders.js";
import { renderChat } from "./components/ai-chat.js";
import { renderForum } from "./forum/forum.js";
import { mountFocusGame } from "./games/focus-game.js";
import { mountMemoryGame } from "./games/memory-game.js";
import { mountPatternGame } from "./games/pattern-game.js";
import { mountSmallTapGame } from "./games/small-tap-game.js";
import { mountSmallMatchGame } from "./games/small-match-game.js";

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const moods = [
  { emoji: "🙂", label: "Happy", value: 5 },
  { emoji: "😌", label: "Calm", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😟", label: "Anxious", value: 2 },
  { emoji: "😴", label: "Tired", value: 1 },
];

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("active");
  });
  const node = document.getElementById(id);
  if (node) {
    node.classList.remove("hidden");
    node.classList.add("active");
  }
}

function drawMoodChart(canvas, logs) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#53c9a8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const points = logs.slice(-10);
  points.forEach((log, i) => {
    const x = (i / Math.max(1, points.length - 1)) * (canvas.width - 40) + 20;
    const y = canvas.height - log.value * 36;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function initMoodCheckin() {
  const moodButtons = document.getElementById("mood-buttons");
  const moodChart = document.getElementById("mood-chart");

  moodButtons.innerHTML = moods
    .map(
      (mood) =>
        `<button class="mood-btn" data-mood="${mood.label}">${mood.emoji}<br/><small>${mood.label}</small></button>`,
    )
    .join("");

  const refresh = () => {
    drawMoodChart(moodChart, store.get("moodLogs", []));
    renderDashboard(document.getElementById("dashboard-root"), store);
  };

  moodButtons.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = moods.find((m) => m.label === btn.dataset.mood);
      const logs = store.get("moodLogs", []);
      logs.push({
        date: new Date().toISOString(),
        moodLabel: mood.label,
        emoji: mood.emoji,
        value: mood.value,
      });
      store.set("moodLogs", logs);
      refresh();
    });
  });

  refresh();
}

function initGames() {
  const root = document.getElementById("game-root");
  const saveScore = (game, score) => {
    const scores = store.get("gameScores", []);
    scores.push({ game, score, date: new Date().toISOString() });
    store.set("gameScores", scores);
    renderDashboard(document.getElementById("dashboard-root"), store);
  };

  document.getElementById("focus-tab").addEventListener("click", () => mountFocusGame(root, saveScore));
  document.getElementById("memory-tab").addEventListener("click", () => mountMemoryGame(root, saveScore));
  document.getElementById("pattern-tab").addEventListener("click", () => mountPatternGame(root, saveScore));

  mountFocusGame(root, saveScore);
}

function initQuickLinks() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.nav));
  });
}

function init() {
  renderNavbar(document.getElementById("app-header"), showScreen);
  renderDashboard(document.getElementById("dashboard-root"), store);
  renderReminders(document.getElementById("reminders-root"), store);
  renderChat(document.getElementById("chat-root"));
  renderForum(document.getElementById("forum-root"), store);

  initMoodCheckin();
  initGames();
  initQuickLinks();

  document.getElementById("start-btn").addEventListener("click", () => showScreen("dashboard-screen"));
}

init();
