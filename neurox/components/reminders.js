const reminderDefs = [
  { key: "hydration", label: "Hydration (every 90 min)", intervalMs: 90 * 60 * 1000 },
  { key: "eyeCare", label: "Eye care 20-20-20", intervalMs: 20 * 60 * 1000 },
  { key: "break", label: "Gameplay break (every 30 min)", intervalMs: 30 * 60 * 1000 },
];

function notify(msg) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`NeuroX Reminder`, { body: msg });
  } else {
    alert(`NeuroX Reminder: ${msg}`);
  }
}

export function renderReminders(container, store) {
  const state = store.get("reminders", {
    hydration: true,
    eyeCare: true,
    break: true,
    hydrationStreak: 0,
    lastHydration: null,
  });

  container.innerHTML = `
    <h2>Reminder Center</h2>
    <p>Support reminders are enabled for all core wellbeing needs.</p>
    <button id="allow-notification" class="btn">Enable Browser Notifications</button>
    <div id="reminder-list"></div>
    <p><strong>Hydration streak:</strong> <span id="streak-value">${state.hydrationStreak || 0}</span> days</p>
    <div class="button-row">
      <button id="hydrate-now" class="btn primary">I drank water</button>
      <button id="test-reminder" class="btn">Send Test Reminder</button>
    </div>
  `;

  container.querySelector("#allow-notification").addEventListener("click", async () => {
    if (!("Notification" in window)) return alert("Notifications unsupported in this browser.");
    await Notification.requestPermission();
  });

  const list = container.querySelector("#reminder-list");
  reminderDefs.forEach((reminder) => {
    const row = document.createElement("label");
    row.className = "post";
    row.innerHTML = `
      <input type="checkbox" data-key="${reminder.key}" ${state[reminder.key] ? "checked" : ""} />
      <strong>${reminder.label}</strong>
      <div class="muted">Interval: ${Math.round(reminder.intervalMs / 60000)} minutes</div>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      state[checkbox.dataset.key] = checkbox.checked;
      store.set("reminders", state);
    });
  });

  container.querySelector("#hydrate-now").addEventListener("click", () => {
    const today = new Date().toDateString();
    if (state.lastHydration !== today) {
      state.hydrationStreak = (state.hydrationStreak || 0) + 1;
      state.lastHydration = today;
      store.set("reminders", state);
      container.querySelector("#streak-value").textContent = state.hydrationStreak;
    }
  });

  container.querySelector("#test-reminder").addEventListener("click", () => {
    notify("Time for water, eye-care, and a short break.");
  });

  reminderDefs.forEach((def) => {
    if (!state[def.key]) return;
    setInterval(() => {
      notify(def.label);
    }, def.intervalMs);
  });
}
