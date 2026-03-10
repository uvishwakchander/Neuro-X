const reminderDefs = [
  { key: "hydration", label: "Hydration reminder (every 90 min)", intervalMs: 90 * 60 * 1000 },
  { key: "eyeCare", label: "Eye care 20-20-20 reminder", intervalMs: 20 * 60 * 1000 },
  { key: "break", label: "Break reminder after 30 min gameplay", intervalMs: 30 * 60 * 1000 },
];

export function renderReminders(container, store) {
  const state = store.get("reminders", {
    hydration: true,
    eyeCare: true,
    break: true,
    hydrationStreak: 0,
    lastHydration: null,
  });

  container.innerHTML = `
    <h2>Wellbeing Reminders</h2>
    <p>Enable supportive nudges to stay hydrated, reduce eye strain, and take breaks.</p>
    <div id="reminder-list"></div>
    <p><strong>Hydration streak:</strong> <span id="streak-value">${state.hydrationStreak || 0}</span> days</p>
    <button id="hydrate-now" class="btn primary">I drank water</button>
  `;

  const list = container.querySelector("#reminder-list");
  reminderDefs.forEach((reminder) => {
    const row = document.createElement("label");
    row.className = "post";
    row.innerHTML = `
      <input type="checkbox" data-key="${reminder.key}" ${state[reminder.key] ? "checked" : ""} />
      ${reminder.label}
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

  reminderDefs.forEach((def) => {
    if (!state[def.key]) return;
    setInterval(() => {
      alert(`NeuroX reminder: ${def.label}`);
    }, def.intervalMs);
  });
}
