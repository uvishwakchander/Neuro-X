const reminderDefs = [
  { key: "hydration", label: "Hydration reminder (every 90 min)", intervalMs: 90 * 60 * 1000 },
  { key: "eyeCare", label: "Eye care 20-20-20 reminder", intervalMs: 20 * 60 * 1000 },
  { key: "break", label: "Break reminder after 30 min gameplay", intervalMs: 30 * 60 * 1000 },
];

const reminderTimers = new Map();

function stopReminderTimer(key) {
  const timerId = reminderTimers.get(key);
  if (!timerId) return;
  clearInterval(timerId);
  reminderTimers.delete(key);
}

function pushReminderMessage(container, message) {
  const feed = container.querySelector("#reminder-feed");
  if (!feed) return;
  const item = document.createElement("div");
  item.className = "reminder-toast";
  item.textContent = message;
  feed.prepend(item);
  setTimeout(() => {
    item.remove();
  }, 6000);
}

function startReminderTimer(def, container) {
  stopReminderTimer(def.key);
  const timerId = setInterval(() => {
    pushReminderMessage(container, `⏰ ${def.label}`);
  }, def.intervalMs);
  reminderTimers.set(def.key, timerId);
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
    <h2>Wellbeing Reminders</h2>
    <p>Enable supportive nudges to stay hydrated, reduce eye strain, and take breaks.</p>
    <div id="reminder-list"></div>
    <p><strong>Hydration streak:</strong> <span id="streak-value">${state.hydrationStreak || 0}</span> days</p>
    <button id="hydrate-now" class="btn primary">I drank water</button>
    <div id="reminder-feed" class="reminder-feed" aria-live="polite"></div>
  `;

  const list = container.querySelector("#reminder-list");

  const renderStatus = () => {
    const activeCount = reminderDefs.filter((def) => Boolean(state[def.key])).length;
    const status = document.createElement("p");
    status.className = "subtle reminder-status";
    status.textContent = `${activeCount}/${reminderDefs.length} health reminders active`;
    list.appendChild(status);
  };

  reminderDefs.forEach((reminder) => {
    const row = document.createElement("div");
    row.className = "post";
    row.innerHTML = `
      <label>
        <input type="checkbox" data-key="${reminder.key}" ${state[reminder.key] ? "checked" : ""} />
        ${reminder.label}
      </label>
      <button class="btn test-reminder" data-key="${reminder.key}">Test now</button>
    `;
    list.appendChild(row);
  });

  renderStatus();

  list.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const key = checkbox.dataset.key;
      state[key] = checkbox.checked;
      store.set("reminders", state);

      const def = reminderDefs.find((reminder) => reminder.key === key);
      if (!def) return;
      if (checkbox.checked) {
        startReminderTimer(def, container);
        pushReminderMessage(container, `✅ Enabled: ${def.label}`);
      } else {
        stopReminderTimer(key);
        pushReminderMessage(container, `⏸️ Disabled: ${def.label}`);
      }

      const note = list.querySelector(".reminder-status");
      if (note) note.remove();
      renderStatus();
    });
  });

  list.querySelectorAll(".test-reminder").forEach((btn) => {
    btn.addEventListener("click", () => {
      const def = reminderDefs.find((item) => item.key === btn.dataset.key);
      if (!def) return;
      pushReminderMessage(container, `🧪 Test reminder: ${def.label}`);
    });
  });

  container.querySelector("#hydrate-now").addEventListener("click", () => {
    const today = new Date().toDateString();
    if (state.lastHydration !== today) {
      state.hydrationStreak = (state.hydrationStreak || 0) + 1;
      state.lastHydration = today;
      store.set("reminders", state);
      container.querySelector("#streak-value").textContent = state.hydrationStreak;
      pushReminderMessage(container, "💧 Hydration streak updated. Great job!");
    }
  });

  reminderDefs.forEach((def) => {
    if (state[def.key]) startReminderTimer(def, container);
    else stopReminderTimer(def.key);
  });
}
