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

const sampleGameScores = [
  { game: "Focus", score: 7, date: "2026-03-01T09:00:00.000Z", player: "Aarav" },
  { game: "Memory", score: 4, date: "2026-03-01T09:10:00.000Z", player: "Maya" },
  { game: "Pattern", score: 6, date: "2026-03-01T09:15:00.000Z", player: "Riya" },
];
const sampleMoodLogs = [
  { date: "2026-03-01T08:00:00.000Z", moodLabel: "Calm", emoji: "😌", value: 4 },
  { date: "2026-03-02T08:00:00.000Z", moodLabel: "Happy", emoji: "🙂", value: 5 },
  { date: "2026-03-03T08:00:00.000Z", moodLabel: "Neutral", emoji: "😐", value: 3 },
];

function ensureSampleData() {
  if (!store.get("neuroxSeeded", false)) {
    if (!store.get("gameScores", []).length) store.set("gameScores", sampleGameScores);
    if (!store.get("moodLogs", []).length) store.set("moodLogs", sampleMoodLogs);
    store.set("neuroxSeeded", true);
  }
}

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
  const otherCheckinNode = document.getElementById("other-checkins");
  const checkinSummary = document.getElementById("checkin-summary");

  moodButtons.innerHTML = moods
    .map(
      (mood) =>
        `<button class="mood-btn" data-mood="${mood.label}">${mood.emoji}<br/><small>${mood.label}</small></button>`,
    )
    .join("");

  otherCheckinNode.innerHTML = checkIns
    .map(
      (item) => `
      <div class="checkin-box">
        <strong>${item.label}</strong>
        <div class="button-row">
          ${item.options
            .map(
              (option) =>
                `<button class="btn checkin-btn" data-checkin="${item.key}" data-value="${option}">${option}</button>`,
            )
            .join("")}
        </div>
      </div>
    `,
    )
    .join("");

  const refresh = () => {
    drawMoodChart(moodChart, store.get("moodLogs", []));
    const latest = store.get("otherCheckins", {});
    const summary = checkIns
      .map((item) => `${item.label}: ${latest[item.key]?.value || "Not set"}`)
      .join(" | ");
    checkinSummary.textContent = summary;
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

  otherCheckinNode.querySelectorAll(".checkin-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const checks = store.get("otherCheckins", {});
      checks[btn.dataset.checkin] = {
        value: btn.dataset.value,
        date: new Date().toISOString(),
      };
      store.set("otherCheckins", checks);
      refresh();
    });
  });

  refresh();
}

function initGames() {
  const root = document.getElementById("game-root");
  const gameScreen = document.getElementById("games-screen");
  const arStateNode = document.getElementById("xr-state");

  const saveScore = (game, score) => {
    const scores = store.get("gameScores", []);
    const profile = store.get("profile", { name: "Player" });
    scores.push({ game, score, date: new Date().toISOString(), player: profile.name });
    store.set("gameScores", scores);
    renderDashboard(document.getElementById("dashboard-root"), store);
  };

  document.getElementById("focus-tab").addEventListener("click", () => mountFocusGame(root, saveScore));
  document.getElementById("memory-tab").addEventListener("click", () => mountMemoryGame(root, saveScore));
  document.getElementById("pattern-tab").addEventListener("click", () => mountPatternGame(root, saveScore));
  document.getElementById("small-tap-tab").addEventListener("click", () => mountSmallTapGame(root, saveScore));
  document.getElementById("small-match-tab").addEventListener("click", () => mountSmallMatchGame(root, saveScore));

  const updateXrLabel = () => {
    const isVr = gameScreen.classList.contains("vr-mode");
    const isAr = gameScreen.classList.contains("ar-mode");
    arStateNode.textContent = `XR Layer: ${isVr ? "VR" : isAr ? "AR" : "Off"}`;
  };

  document.getElementById("toggle-vr-mode").addEventListener("click", () => {
    gameScreen.classList.toggle("vr-mode");
    if (gameScreen.classList.contains("vr-mode")) gameScreen.classList.remove("ar-mode");
    updateXrLabel();
  });

  document.getElementById("toggle-ar-mode").addEventListener("click", () => {
    gameScreen.classList.toggle("ar-mode");
    if (gameScreen.classList.contains("ar-mode")) gameScreen.classList.remove("vr-mode");
    updateXrLabel();
  });

  updateXrLabel();
  mountFocusGame(root, saveScore);
}


function initVrDemoLayer() {
  const canvas = document.getElementById("vr-demo-canvas");
  const startBtn = document.getElementById("start-vr-demo");
  const stopBtn = document.getElementById("stop-vr-demo");
  if (!canvas || !startBtn || !stopBtn) return;

  const ctx = canvas.getContext("2d");
  let rafId = null;
  let phase = 0;

  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (Math.PI * 2 * i) / 24,
    speed: 0.003 + (i % 7) * 0.0004,
    radius: 45 + (i % 5) * 12,
  }));

  const draw = () => {
    phase += 0.018;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const breath = 40 + Math.sin(phase) * 22;

    const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
    grad.addColorStop(0, "rgba(83, 201, 168, 0.9)");
    grad.addColorStop(1, "rgba(79, 124, 255, 0.12)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, breath + 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    particles.forEach((p) => {
      p.angle += p.speed;
      const x = centerX + Math.cos(p.angle + phase * 0.35) * (p.radius + breath * 0.25);
      const y = centerY + Math.sin(p.angle + phase * 0.35) * (p.radius + breath * 0.25);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Breathe in • Hold • Breathe out", centerX, centerY + 6);

    rafId = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  startBtn.addEventListener("click", () => {
    if (rafId) cancelAnimationFrame(rafId);
    draw();
  });

  stopBtn.addEventListener("click", stop);
}

function initQuickLinks() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.nav));
  });
}

function initOnboarding() {
  const startBtn = document.getElementById("start-btn");
  const nameInput = document.getElementById("player-name");
  const hint = document.getElementById("player-name-hint");

  const existing = store.get("profile", null);
  if (existing?.name) {
    nameInput.value = existing.name;
    startBtn.textContent = `Continue as ${existing.name}`;
  }

  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      hint.textContent = "Please enter your name to start your session.";
      nameInput.focus();
      return;
    }

    store.set("profile", { name, startedAt: new Date().toISOString() });
    renderNavbar(document.getElementById("app-header"), showScreen, name);
    renderDashboard(document.getElementById("dashboard-root"), store);
    showScreen("dashboard-screen");
  });
}

function init() {
  ensureSampleData();

  const profile = store.get("profile", { name: "Guest" });
  renderNavbar(document.getElementById("app-header"), showScreen, profile.name);
  renderDashboard(document.getElementById("dashboard-root"), store);
  renderReminders(document.getElementById("reminders-root"), store);
  renderChat(document.getElementById("chat-root"));
  renderForum(document.getElementById("forum-root"), store);

  initMoodCheckin();
  initGames();
  initVrDemoLayer();
  initQuickLinks();
  initOnboarding();
}

init();
