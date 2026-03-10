export function renderNavbar(container, onNavigate, playerName) {
  container.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <div>
        <strong>🧠 NeuroX Mind Arena</strong>
        <div class="player-badge">Player: ${playerName || "Guest"}</div>
      </div>
      <div class="nav-links">
        <button class="btn" data-nav="dashboard-screen">Dashboard</button>
        <button class="btn" data-nav="games-screen">Games</button>
        <button class="btn" data-nav="chat-screen">AI Support</button>
        <button class="btn" data-nav="reminders-screen">Reminders</button>
        <button class="btn" data-nav="forum-screen">Forum</button>
      </div>
    </nav>
  `;

  container.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => onNavigate(btn.dataset.nav));
  });
}
