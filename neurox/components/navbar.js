export function renderNavbar(container, onNavigate) {
  container.innerHTML = `
    <nav class="navbar" aria-label="Main navigation">
      <strong>🧠 NeuroX</strong>
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
