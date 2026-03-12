function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderNavbar(container, onNavigate, playerName = "Guest") {
  const safeName = escapeHtml(playerName || "Guest");

  container.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <div>
        <strong>🧠 NeuroX</strong>
        <div class="welcome-chip">Hi, ${safeName} 👋</div>
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
