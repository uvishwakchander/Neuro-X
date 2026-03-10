# NeuroX Working Demo (Step-by-Step)

Use this script to demo the MVP end-to-end in ~8–10 minutes.

## 1) Start the app locally

From repository root:

```bash
python -m http.server 4173 --directory .
```

Open:

- `http://localhost:4173/neurox/index.html`

> Tip: Use a fresh profile/incognito for a clean first-run demo.

---

## 1A) Run from Windows CMD (step-by-step)

1. Open **Command Prompt**.
2. Move to repository folder:

```cmd
cd /d C:\path\to\Neuro-X
```

3. Start local server:

```cmd
python -m http.server 4173 --directory .
```

4. Open the app:

```cmd
start http://localhost:4173/neurox/index.html
```

5. Leave CMD running during demo. Use `Ctrl + C` to stop server after demo.

---

## 2) Player sign-in + Landing screen (45s)

1. Enter a player name at open (example: **Sanju Samson**).
2. Click **Continue** and show player name appears in navbar.
3. Show the NeuroX intro text and click **Start Mission**.
4. Explain this is a static, backend-free app storing data in browser LocalStorage.

Expected result:

- Dashboard screen opens.

---

## 3) Mood check-in + trend chart (1 min)

1. In **Daily Mood Check-In**, click 2–3 moods (e.g., 🙂 then 😌 then 😟).
2. Point at mood trend chart updates.
3. Refresh browser once and show mood data remains.

Expected result:

- Mood points persist and dashboard mood trend text updates.

---

## 4) Games demo (3 min)

Open **Play Games** from quick access or navbar.

### A. Focus Game

1. Click **Start Focus Game**.
2. Hit moving target a few times and intentionally miss until game ends.

Expected result:

- Final score alert appears.
- Score is saved to dashboard statistics.

### B. Memory Game

1. Switch to **Memory Game**.
2. Start game and pass at least one round.
3. Make one wrong click.

Expected result:

- Round-end alert appears and score is saved.

### C. Pattern Game

1. Switch to **Pattern Game** and press start.
2. Answer one correctly, then one incorrectly.

Expected result:

- Score increments on correct answer, ends/saves on wrong answer.

### D. Small: Speed Tap

1. Open **Small: Speed Tap** and press **Start**.
2. Tap repeatedly for 15 seconds.

Expected result:

- Completion alert with score and saved game event.

### E. Small: Quick Match

1. Open **Small: Quick Match** and press **Start**.
2. Play through multiple rounds.

Expected result:

- 10-round completion alert and score saved.

---

## 5) AI support chat (1 min)

1. Navigate to **AI Support**.
2. Send messages such as:
   - "I feel anxious"
   - "I cannot focus"
   - "I am tired"

Expected result:

- Rule-based supportive replies appear (breathing/focus/break suggestions).

---

## 6) Reminders + hydration streak (1 min)

1. Navigate to **Reminders**.
2. Toggle one reminder off and on.
3. Click **I drank water** once.

Expected result:

- Toggle states persist.
- Hydration streak increments once per day.

---

## 7) Community forum (1–2 min)

1. Navigate to **Forum**.
2. Create a post with category (ADHD/Autism/Dyslexia/General Support).
3. Like the post and add one comment.
4. Refresh browser.

Expected result:

- Post, likes, and comments remain after refresh.

---

## 8) Dashboard proof (1 min)

1. Return to **Dashboard**.
2. Show updates to:
   - Games Played
   - Avg Focus Score
   - Mood Trend
   - Hydration Streak
3. Point to progress chart line.

Expected result:

- Stats reflect actions performed during demo.

---

## 9) Optional reset (for repeated demos)

In browser DevTools console:

```js
localStorage.clear();
location.reload();
```

This resets NeuroX MVP state to first-run.
