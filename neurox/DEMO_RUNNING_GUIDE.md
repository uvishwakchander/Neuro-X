# NeuroX Demo Running Guide

This guide explains how to run and verify the NeuroX static MVP demo (`neurox/`) locally, including a quick validation checklist for the latest reminder and forum safety fixes.

## 1) Prerequisites

- Python 3.8+ (for a simple static server)
- A modern browser (Chrome, Edge, Firefox, Safari)
- Optional: Node.js (only for JavaScript syntax checks)

## 2) Start the Demo Locally

From the repository root:

```bash
python -m http.server 4173 --directory .
```

Then open:

- `http://localhost:4173/neurox/`

> Why this command? The app is fully static and expects relative imports/assets, so serving over HTTP avoids browser restrictions seen with `file://`.

## 3) Core Navigation Smoke Test

After opening the app, test these routes using the top navigation:

1. **Games**: launch each mini game and confirm score updates.
2. **Dashboard**: verify score cards and leaderboard render.
3. **AI Chat**: send a few messages and confirm bot replies.
4. **Forum**: create a post, like it, and add a comment.
5. **Reminders**: toggle reminders and use hydration streak button.

## 4) Verify Latest Fixes

## A. Reminder toggle behavior (interval cleanup)

1. Go to **Reminders**.
2. Ensure a reminder is enabled, then disable it.
3. Confirm that reminder notifications stop without requiring page reload.
4. Re-enable it and confirm notifications resume.

Expected: checkbox state changes should immediately control whether the corresponding reminder timer is active.

## B. Forum stored XSS protection

1. Go to **Forum** and create a post with HTML-like input, for example:
   - Title: `<img src=x onerror=alert(1)>`
   - Body: `<script>alert('xss')</script>`
2. Submit and reload the page.

Expected:
- Content appears as plain text (escaped), not executable HTML.
- No script execution occurs during render, including from persisted localStorage posts/comments.

## 5) Optional Developer Checks

Run syntax checks:

```bash
node --check neurox/components/reminders.js
node --check neurox/forum/forum.js
```

## 6) Troubleshooting

- **Port in use**: change to another port, e.g. `python -m http.server 4180 --directory .`
- **Stale localStorage data**: clear site storage for `localhost` and reload.
- **No notifications observed quickly**: reminder intervals are real-time (20/30/90 minutes by default), so behavior is best validated by toggling state and confirming no unexpected alerts continue after disabling.

## 7) Demo Readiness Checklist

- [ ] App loads from `http://localhost:4173/neurox/`
- [ ] Games, Dashboard, Chat, Forum, and Reminders are reachable
- [ ] Reminder toggles immediately stop/start reminder schedules
- [ ] Forum safely renders user text without executing HTML/JS payloads
- [ ] Hydration streak increments only once per day

